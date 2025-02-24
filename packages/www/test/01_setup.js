import chai from "chai";
import chaiEnzyme from "chai-enzyme";
import Enzyme from "enzyme";
import EnzymeAdapter from "enzyme-adapter-react-16";
import {JSDOM} from "jsdom";
import "mock-local-storage";
import packageJson from "../package.json";

const jsdom = new JSDOM("<html><div id=\"react-root\"></div></html>", {url: "http://localhost:8080"});
global.window = jsdom.window;
global.document = jsdom.window.document;
global.navigator = {
    userAgent: "node.js"
};
global.location = jsdom.window.location;

Enzyme.configure({adapter: new EnzymeAdapter()});
chai.use(chaiEnzyme());

global.window.NAME = packageJson.name;
global.window.VERSION = packageJson.version;
global.window.ENVIRONMENT = process.env.NODE_ENV;
global.window.SENTRY_DSN = "https://meow@sentry.io/woof";
global.window.LOGGER = {
    level: "trace",
    streams: {
        console: true
    }
};
global.window.$crisp = [];
