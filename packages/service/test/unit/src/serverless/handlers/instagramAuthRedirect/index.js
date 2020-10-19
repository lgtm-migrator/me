import {expect} from "chai";
import proxyquire from "proxyquire";
import sinon from "sinon";

describe("instagramAuthRedirect", function () {
    this.timeout(5000);

    it("redirects to the correct page", function (done) {
        const stubCode = "grr";
        const stubEvent = {queryStringParameters: {code: stubCode}};
        const stubContext = {};
        const stubResponse = ["meow"];
        const proxyquireStubs = {
            "../../util/configureEnvironment": {
                "default": sinon.stub().returns(Promise.resolve()),
            },
            "@randy.tarampi/serverless": {
                "responseBuilder": sinon.stub().callsFake((body, status, headers) => {
                    try {
                        expect(body).to.eql(null);
                        expect(status).to.eql(302);
                        expect(headers).to.eql({
                            Location: `https://api.instagram.com/oauth/authorize/?client_id=${process.env.INSTAGRAM_API_KEY}&redirect_uri=${encodeURIComponent(process.env.INSTAGRAM_AUTH_CALLBACK_URI)}&response_type=code&scope=user_profile,user_media`
                        });
                        return stubResponse;
                    } catch (error) {
                        done(error);
                    }
                })
            },
            "../../util/response/returnErrorResponse": {
                "default": sinon.stub().callsFake((event, context, callback) => {
                    try {
                        expect(callback).to.eql(stubCallback);
                        return stubCallback;
                    } catch (error) {
                        done(error);
                    }
                })
            }
        };
        const stubCallback = (error, postResponse) => {
            try {
                expect(error).to.not.be.ok;
                expect(postResponse).to.eql(stubResponse);
                expect(proxyquireStubs["../../util/configureEnvironment"].default.calledOnce).to.eql(true);
                expect(proxyquireStubs["@randy.tarampi/serverless"].responseBuilder.calledOnce).to.eql(true);
                expect(proxyquireStubs["../../util/response/returnErrorResponse"].default.calledOnce).to.eql(true);
                done();
            } catch (expectationError) {
                done(expectationError);
            }
        };
        const proxyquiredinstagramAuthRedirect = proxyquire("../../../../../../src/serverless/handlers/instagramAuthRedirect", proxyquireStubs);

        proxyquiredinstagramAuthRedirect.default(stubEvent, stubContext, stubCallback);
    });

    it("`returnErrorResponse` on error", function (done) {
        const stubCode = "grr";
        const stubEvent = {queryStringParameters: {code: stubCode}};
        const stubContext = {};
        const stubError = new Error("woof");
        const proxyquireStubs = {
            "../../util/configureEnvironment": {
                "default": sinon.stub().returns(Promise.resolve()),
            },
            "@randy.tarampi/serverless": {
                "responseBuilder": sinon.stub().throws(stubError)
            },
            "../../util/response/returnErrorResponse": {
                "default": sinon.stub().callsFake((event, context, callback) => {
                    try {
                        expect(callback).to.eql(stubCallback);
                        return stubErrorCallback;
                    } catch (error) {
                        done(error);
                    }
                })
            }
        };
        const stubCallback = () => {
            throw new Error("Wtf? This should've thrown");
        };
        const stubErrorCallback = error => {
            try {
                expect(error.message).to.eql(stubError.message);
                done();
            } catch (expectationError) {
                done(expectationError);
            }
        };
        const proxyquiredinstagramAuthRedirect = proxyquire("../../../../../../src/serverless/handlers/instagramAuthRedirect", proxyquireStubs);

        proxyquiredinstagramAuthRedirect.default(stubEvent, stubContext, stubCallback);
    });
});
