import {expect} from "chai";
import {Map} from "immutable";
import proxyquire from "proxyquire";
import React from "react";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import sinon from "sinon";
import selectors from "../../../../../src/lib/data/selectors";
import {shallow} from "../../../../../src/test/util";

// FIXME-RT: Unignore these tests when I figure out how to pass `<Provider store={store}...` to enzyme
xdescribe("Error", function () {
    let mockStore;
    let stubMiddleware;
    let stubInitialState;
    let stubStore;
    let stubLocation;
    let stubHasError;
    let stubError;
    let stubErrorCode;
    let stubErrorMessage;
    let stubErrorTimeoutHandlerId;

    beforeEach(function () {
        stubMiddleware = [thunk];
        mockStore = configureStore(stubMiddleware);
        stubInitialState = Map();
        stubStore = mockStore(stubInitialState);

        stubLocation = "woof";
        stubHasError = "grr";
        stubError = "meow";
        stubErrorCode = "rawr";
        stubErrorMessage = "boof";
        stubErrorTimeoutHandlerId = "argh";

        sinon.stub(selectors, "getLocation").returns(stubLocation);
        sinon.stub(selectors, "hasError").returns(stubHasError);
        sinon.stub(selectors, "getError").returns(stubError);
        sinon.stub(selectors, "getErrorCode").returns(stubErrorCode);
        sinon.stub(selectors, "getErrorMessage").returns(stubErrorMessage);
        sinon.stub(selectors, "getErrorTimeoutHandlerId").returns(stubErrorTimeoutHandlerId);
    });

    afterEach(function () {
        selectors.getLocation.restore();
        selectors.hasError.restore();
        selectors.getError.restore();
        selectors.getErrorCode.restore();
        selectors.getErrorMessage.restore();
        selectors.getErrorTimeoutHandlerId.restore();
    });

    it("receives default props", function () {
        const clearErrorStub = sinon.stub().returns(() => Promise.resolve());
        const clearErrorTimeoutHandlerStub = sinon.stub().returns(() => Promise.resolve());
        const routerPushStub = sinon.stub().returns({type: "WOOF"});
        const proxyquiredError = proxyquire("../../../../../src/lib/containers/error/error", {
            "../../actions/error/clearError": {
                "default": clearErrorStub
            },
            "../../actions/error/clearErrorTimeoutHandler": {
                "default": clearErrorTimeoutHandlerStub
            },
            "connected-react-router/immutable": {
                "push": routerPushStub
            }
        });
        const Error = proxyquiredError.default;

        const rendered = shallow(stubStore)(<Error/>);
        let renderCount = 1;
        const expectedProps = {redirectionLocation: "/", redirectionTimeout: 10};

        expect(rendered).to.have.props(expectedProps);

        expect(selectors.getLocation.callCount).to.eql(renderCount);
        sinon.assert.calledWith(selectors.getLocation, stubInitialState);
        expect(selectors.hasError.callCount).to.eql(renderCount);
        sinon.assert.calledWith(selectors.hasError, stubInitialState);
        expect(selectors.getError.callCount).to.eql(renderCount);
        sinon.assert.calledWith(selectors.getError, stubInitialState);
        expect(selectors.getErrorCode.callCount).to.eql(renderCount);
        sinon.assert.calledWith(selectors.getErrorCode, stubInitialState);
        expect(selectors.getErrorMessage.callCount).to.eql(renderCount);
        sinon.assert.calledWith(selectors.getErrorMessage, stubInitialState);
        expect(rendered).to.have.prop("location", stubLocation);
        expect(rendered).to.have.prop("hasError", stubHasError);
        expect(rendered).to.have.prop("error", stubError);
        expect(rendered).to.have.prop("errorCode", stubErrorCode);
        expect(rendered).to.have.prop("errorMessage", stubErrorMessage);

        expect(clearErrorStub.notCalled).to.eql(true);
        expect(clearErrorTimeoutHandlerStub.notCalled).to.eql(true);
        expect(routerPushStub.notCalled).to.eql(true);
        expect(rendered).to.have.prop("timedRedirect");
        expect(rendered).to.have.prop("clearErrorTimeoutHandler");
    });

    it("propagates props", function () {
        const stubProps = {redirectionLocation: "/woof", redirectionTimeout: 1};
        const clearErrorStub = sinon.stub().returns(() => Promise.resolve());
        const clearErrorTimeoutHandlerStub = sinon.stub().returns(() => Promise.resolve());
        const routerPushStub = sinon.stub().returns({type: "WOOF"});
        const proxyquiredError = proxyquire("../../../../../src/lib/containers/error/error", {
            "../../actions/error/clearError": {
                "default": clearErrorStub
            },
            "../../actions/error/clearErrorTimeoutHandler": {
                "default": clearErrorTimeoutHandlerStub
            },
            "connected-react-router/immutable": {
                "push": routerPushStub
            }
        });
        const Error = proxyquiredError.default;

        const rendered = shallow(stubStore)(<Error {...stubProps} />);
        let renderCount = 1;

        expect(rendered).to.have.props(stubProps);

        expect(selectors.getLocation.callCount).to.eql(renderCount);
        sinon.assert.calledWith(selectors.getLocation, stubInitialState);
        expect(selectors.hasError.callCount).to.eql(renderCount);
        sinon.assert.calledWith(selectors.hasError, stubInitialState);
        expect(selectors.getError.callCount).to.eql(renderCount);
        sinon.assert.calledWith(selectors.getError, stubInitialState);
        expect(selectors.getErrorCode.callCount).to.eql(renderCount);
        sinon.assert.calledWith(selectors.getErrorCode, stubInitialState);
        expect(selectors.getErrorMessage.callCount).to.eql(renderCount);
        sinon.assert.calledWith(selectors.getErrorMessage, stubInitialState);
        expect(rendered).to.have.prop("location", stubLocation);
        expect(rendered).to.have.prop("hasError", stubHasError);
        expect(rendered).to.have.prop("error", stubError);
        expect(rendered).to.have.prop("errorCode", stubErrorCode);
        expect(rendered).to.have.prop("errorMessage", stubErrorMessage);

        expect(clearErrorStub.notCalled).to.eql(true);
        expect(clearErrorTimeoutHandlerStub.notCalled).to.eql(true);
        expect(routerPushStub.notCalled).to.eql(true);
        expect(rendered).to.have.prop("timedRedirect");
        expect(rendered).to.have.prop("clearErrorTimeoutHandler");
    });

    it("dispatches `timedRedirect` properly (redirects)", function () {
        const stubProps = {redirectionLocation: "/woof", redirectionTimeout: 1};
        const clearErrorStub = sinon.stub().returns(() => Promise.resolve());
        const clearErrorTimeoutHandlerStub = sinon.stub().returns(() => Promise.resolve());
        const routerPushStub = sinon.stub().returns({type: "WOOF"});
        const proxyquiredError = proxyquire("../../../../../src/lib/containers/error/error", {
            "../../actions/error/clearError": {
                "default": clearErrorStub
            },
            "../../actions/error/clearErrorTimeoutHandler": {
                "default": clearErrorTimeoutHandlerStub
            },
            "connected-react-router/immutable": {
                "push": routerPushStub
            }
        });
        const Error = proxyquiredError.default;

        const rendered = shallow(stubStore)(<Error {...stubProps} />);

        expect(rendered).to.have.props(stubProps);

        expect(clearErrorStub.notCalled).to.eql(true);
        expect(clearErrorTimeoutHandlerStub.notCalled).to.eql(true);
        expect(routerPushStub.notCalled).to.eql(true);
        expect(rendered).to.have.prop("timedRedirect");
        expect(rendered).to.have.prop("clearErrorTimeoutHandler");

        const mappedTimedRedirect = rendered.prop("timedRedirect");

        return mappedTimedRedirect()
            .then(() => {
                expect(clearErrorStub.calledOnce).to.eql(true);
                expect(clearErrorTimeoutHandlerStub.notCalled).to.eql(true);
                expect(routerPushStub.calledOnce).to.eql(true);
                sinon.assert.calledWith(routerPushStub, stubProps.redirectionLocation);
            });
    });

    it("dispatches `timedRedirect` properly (no redirect)", function () {
        const stubProps = {redirectionLocation: window.location.pathname, redirectionTimeout: 1};
        const clearErrorStub = sinon.stub().returns(() => Promise.resolve());
        const clearErrorTimeoutHandlerStub = sinon.stub().returns(() => Promise.resolve());
        const routerPushStub = sinon.stub().returns({type: "WOOF"});
        const proxyquiredError = proxyquire("../../../../../src/lib/containers/error/error", {
            "../../actions/error/clearError": {
                "default": clearErrorStub
            },
            "../../actions/error/clearErrorTimeoutHandler": {
                "default": clearErrorTimeoutHandlerStub
            },
            "connected-react-router/immutable": {
                "push": routerPushStub
            }
        });
        const Error = proxyquiredError.default;

        const rendered = shallow(stubStore)(<Error {...stubProps} />);

        expect(rendered).to.have.props(stubProps);

        expect(clearErrorStub.notCalled).to.eql(true);
        expect(clearErrorTimeoutHandlerStub.notCalled).to.eql(true);
        expect(routerPushStub.notCalled).to.eql(true);
        expect(rendered).to.have.prop("timedRedirect");
        expect(rendered).to.have.prop("clearErrorTimeoutHandler");

        const mappedTimedRedirect = rendered.prop("timedRedirect");

        return mappedTimedRedirect()
            .then(() => {
                expect(clearErrorStub.notCalled).to.eql(true);
                expect(clearErrorTimeoutHandlerStub.notCalled).to.eql(true);
                expect(routerPushStub.notCalled).to.eql(true);
            });
    });
});
