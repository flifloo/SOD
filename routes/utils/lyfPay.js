const crypto = require("crypto");
const models = require("../../models");


function macCalculator(params, key) {
    return crypto.createHmac("sha1", key).update(Object.values(params).join("*")).digest("hex");
}

async function sendPayment(req, res, order) {
    let payment = await models.Payment.create();
    await order.setPayment(payment);
    await payment.reload();

    let baseUrl = `${req.protocol}://${req.hostname}/order`;
    let config = req.app.get("config").lyfPay;
    let url = config.url + "/Payment.aspx?";

    let params = {
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
        additionalData: JSON.stringify({
            "callBackUrl": baseUrl+"/callback",
            "callBackEmail":config.warningEmail
        }),
        enforcedIdentification: false
    };

    params.mac = macCalculator(params, config.secureKey);
    params.additionalDataEncoded = Buffer.from(params.additionalData).toString("base64");
    params.additionalData = undefined;

    url += Object.keys(params)
        .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
        .join("&");

    res.redirect(307, url);
}


module.exports = {sendPayment: sendPayment};
