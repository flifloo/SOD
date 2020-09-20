const crypto = require("crypto");
const models = require("../../models");
const error = require("./error");


function macCalculator(params, key) {
    return crypto.createHmac("sha1", key).update(Object.values(params).join("*")).digest("hex");
}

async function sendPayment(req, res, order) {
    if (order.paid)
        return error(req, res, "Order already paid !", 400);

    let payment = await models.Payment.create();
    await payment.setOrder(order);
    await payment.reload();

    let baseUrl = `https://${req.hostname}/order`;
    let config = req.app.get("config").lyfPay;
    let url = "";
    let params = {};
    let additionalData = JSON.stringify({
        "callBackUrl": baseUrl+"/callback",
        "callBackEmail":config.warningEmail
    });

    if (req.body.payment === "lyfPay") {
        url = config.url + "/Payment.aspx?";
        params = {
            lang: "fr",
            version: "v2.0",
            timestamp: Math.floor(payment.date/1000),
            posUuid: config.posUuid,
            shopReference: payment.shopReference,
            shopOrderReference: order.id,
            deliveryFeesAmount: 0,
            amount: order.price*100,
            currency: "EUR",
            mode: "IMMEDIATE",
            onSuccess: baseUrl + "/success",
            onCancel: baseUrl+"/cancel",
            onError: baseUrl+"/error",
            additionalData: additionalData,
            enforcedIdentification: false
        };
    } else if (req.body.payment === "creditCard") {
        url = config.url + "/PaymentCb.aspx?";
        params = {
            lang: "fr",
            posUuid: config.posUuid,
            shopReference: payment.shopReference,
            shopOrderReference: order.id,
            deliveryFeesAmount: 0,
            amount: order.price*100,
            currency: "EUR",
            onSuccess: baseUrl + "/success",
            onError: baseUrl+"/error",
            additionalData: additionalData,
            callbackRequired: true,
            mode: "IMMEDIATE"
        };
    }

    params.mac = macCalculator(params, config.secureKey);
    params.additionalDataEncoded = Buffer.from(params.additionalData).toString("base64");
    params.additionalData = undefined;
    if (req.body.payment === "creditCard")
        params.version = "v2.0";

    url += Object.keys(params)
        .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
        .join("&");

    req.session.lastOrder = order;

    res.redirect(307, url);
}

async function checkPayment(req, res) {
    let config = req.app.get("config").lyfPay;

    let params = {
        posUuid: req.body.posUuid,
        shopReference: req.body.shopReference,
        shopOrderReference: req.body.shopOrderReference,
        amount: req.body.amount,
        discount: req.body.discount,
        currency: req.body.currency,
        status: req.body.status,
        creationDate: req.body.creationDate,
        transactionUuid: req.body.transactionUuid,
        additionalData: req.body.additionalData,
    };

    if (macCalculator(params, config.secureKey).toUpperCase() !== req.body.mac)
        return error(req, res, "Invalid MAC", 400);

    let payment = await models.Payment.findByPk(params.shopReference, {include: models.Order});
    if (!payment)
        return error(req, res, "Invalid shopReference !", 400);

    payment.amount = params.amount;
    payment.discount = params.discount;
    payment.status = params.status === "VALIDATED";
    payment.date = params.creationDate;
    payment.transactionUuid = params.transactionUuid;
    await payment.save();

    if (payment.status) {
        payment.Order.paid = payment.status;
        await payment.Order.save();
    }

    res.send("OK", 200);
}


module.exports = {
    sendPayment: sendPayment,
    checkPayment: checkPayment
};
