import {expect} from "chai";
import * as exiftoolModule from "exiftool-vendored";
import path from "path";
import puppeteer from "puppeteer";
import sinon from "sinon";
import renderPdf from "../../../../src/lib/renderPdf";

describe("renderPdf", function () {
    const PRINTABLE_PUPPETEER_NO_SANDBOX = process.env.PRINTABLE_PUPPETEER_NO_SANDBOX;

    let stubPrintableHtml;
    let stubPrintable;
    let stubPrintableDestinationDirectory;
    let stubExpectedPages;
    let stubActualPages;
    let stubPdfFileSize;
    let stubPuppeteerPage;
    let stubPuppeteerBrowser;
    let stubExifToolRead;
    let stubExifToolWrite;
    let stubExifToolEnd;

    beforeEach(function () {
        stubActualPages = 1;
        stubExpectedPages = stubActualPages;
        stubPdfFileSize = "woof KiB";
        stubPrintableDestinationDirectory = "/foo/bar";
        stubPrintableHtml = "woof";
        stubPrintable = { // NOTE-RT: Ideally this would be a class that implemented a printable interface, but don't do that or the fanciness we're doing with `@randy.tarampi/js/lib/emoji/bear` yet either.
            filename: "meow",
            pdfRenderOptions: {
                mediaType: "grr"
            },
            pdfRenderExpectations: {
                pages: stubExpectedPages
            },
            pdfMetadata: {
                rawr: "argh"
            }
        };

        stubPuppeteerPage = {
            emulateMediaType: sinon.stub().returns(Promise.resolve()),
            setContent: sinon.stub().returns(Promise.resolve()),
            pdf: sinon.stub().returns(Promise.resolve())
        };
        stubPuppeteerBrowser = {
            newPage: sinon.stub().returns(Promise.resolve(stubPuppeteerPage)),
            close: sinon.stub().returns(Promise.resolve())
        };
        sinon.stub(puppeteer, "launch").returns(Promise.resolve(stubPuppeteerBrowser));

        stubExifToolRead = sinon.stub(exiftoolModule.ExifTool.prototype, "read").returns(Promise.resolve({
            PageCount: stubActualPages,
            FileSize: stubPdfFileSize
        }));
        stubExifToolWrite = sinon.stub(exiftoolModule.ExifTool.prototype, "write").returns(Promise.resolve());
        stubExifToolEnd = sinon.stub(exiftoolModule.ExifTool.prototype, "end").returns(Promise.resolve());
    });

    afterEach(function () {
        puppeteer.launch.restore();

        stubExifToolRead.restore();
        stubExifToolWrite.restore();
        stubExifToolEnd.restore();

        process.env.PRINTABLE_PUPPETEER_NO_SANDBOX = PRINTABLE_PUPPETEER_NO_SANDBOX;
    });

    it("is hooked into `puppeteer` correctly", function () {
        delete process.env.PRINTABLE_PUPPETEER_NO_SANDBOX;

        return renderPdf({
            printableHtml: stubPrintableHtml,
            printable: stubPrintable,
            printableDestinationDirectory: stubPrintableDestinationDirectory
        })
            .then(() => {
                expect(puppeteer.launch.calledOnce).to.be.ok;
                sinon.assert.calledWithExactly(puppeteer.launch, {args: []});

                expect(stubPuppeteerBrowser.newPage.calledOnce).to.be.ok;
                sinon.assert.calledWithExactly(stubPuppeteerBrowser.newPage);

                expect(stubPuppeteerPage.emulateMediaType.calledOnce).to.be.ok;
                sinon.assert.calledWithExactly(stubPuppeteerPage.emulateMediaType, stubPrintable.pdfRenderOptions.mediaType);

                expect(stubPuppeteerPage.setContent.calledOnce).to.be.ok;
                sinon.assert.calledWithExactly(stubPuppeteerPage.setContent, stubPrintableHtml, {waitUntil: "networkidle0"});

                expect(stubPuppeteerPage.pdf.calledOnce).to.be.ok;
                sinon.assert.calledWithExactly(stubPuppeteerPage.pdf, {
                    path: path.join(stubPrintableDestinationDirectory, `${stubPrintable.filename}.pdf`),
                    format: "Letter",
                    printBackground: true,
                    ...stubPrintable.pdfRenderOptions
                });

                expect(stubPuppeteerBrowser.close.calledOnce).to.be.ok;
                sinon.assert.calledWithExactly(stubPuppeteerBrowser.close);
            });
    });

    it("runs `puppeteer` without the sandbox if `process.env.PRINTABLE_PUPPETEER_NO_SANDBOX`", function () {
        process.env.PRINTABLE_PUPPETEER_NO_SANDBOX = "true";

        return renderPdf({
            printableHtml: stubPrintableHtml,
            printable: stubPrintable,
            printableDestinationDirectory: stubPrintableDestinationDirectory
        })
            .then(() => {
                expect(puppeteer.launch.calledOnce).to.be.ok;
                sinon.assert.calledWithExactly(puppeteer.launch, {args: ["--no-sandbox"]});
            });
    });

    it("`puppeteer` defaults `media` emulation to `print", function () {
        delete stubPrintable.pdfRenderOptions.mediaType;

        return renderPdf({
            printableHtml: stubPrintableHtml,
            printable: stubPrintable,
            printableDestinationDirectory: stubPrintableDestinationDirectory
        })
            .then(() => {
                expect(puppeteer.launch.calledOnce).to.be.ok;
                sinon.assert.calledWithExactly(puppeteer.launch, {args: ["--no-sandbox"]});

                expect(stubPuppeteerPage.emulateMediaType.calledOnce).to.be.ok;
                sinon.assert.calledWithExactly(stubPuppeteerPage.emulateMediaType, "print");

                expect(stubPuppeteerBrowser.close.calledOnce).to.be.ok;
                sinon.assert.calledWithExactly(stubPuppeteerBrowser.close);
            });
    });

    it("is hooked into `exifTool` correctly", function () {
        return renderPdf({
            printableHtml: stubPrintableHtml,
            printable: stubPrintable,
            printableDestinationDirectory: stubPrintableDestinationDirectory
        })
            .then(() => {
                const stubPdfPath = path.join(stubPrintableDestinationDirectory, `${stubPrintable.filename}.pdf`);

                expect(stubExifToolRead.calledOnce).to.be.ok;
                sinon.assert.calledWithExactly(stubExifToolRead, stubPdfPath);

                expect(stubExifToolWrite.calledOnce).to.be.ok;
                sinon.assert.calledWithExactly(stubExifToolWrite, stubPdfPath, stubPrintable.pdfMetadata);

                expect(stubExifToolEnd.calledOnce).to.be.ok;
                sinon.assert.calledWithExactly(stubExifToolEnd);
            });
    });

    it("verifies `pdfExpectations.pages`", function () {
        stubPrintable.pdfRenderExpectations.pages = 2 * stubExpectedPages;

        return renderPdf({
            printableHtml: stubPrintableHtml,
            printable: stubPrintable,
            printableDestinationDirectory: stubPrintableDestinationDirectory
        })
            .then(() => {
                throw new Error("Wtf? This should've thrown");
            })
            .catch(error => {
                expect(error.message).to.eql(`Expected PDF to have ${stubPrintable.pdfRenderExpectations.pages} pages, but it has ${stubActualPages} instead`);

                const stubPdfPath = path.join(stubPrintableDestinationDirectory, `${stubPrintable.filename}.pdf`);

                expect(stubExifToolRead.calledOnce).to.be.ok;
                sinon.assert.calledWithExactly(stubExifToolRead, stubPdfPath);

                expect(stubExifToolWrite.notCalled).to.be.ok;
                expect(stubExifToolEnd.notCalled).to.be.ok;
            });
    });

    it("Doesn't check `pdfExpectations.pages` if no expectation is set", function () {
        delete stubPrintable.pdfRenderExpectations;

        return renderPdf({
            printableHtml: stubPrintableHtml,
            printable: stubPrintable,
            printableDestinationDirectory: stubPrintableDestinationDirectory
        })
            .then(() => {
                expect(stubExifToolEnd.calledOnce).to.be.ok;
                sinon.assert.calledWithExactly(stubExifToolEnd);
            });
    });

    it("verifies that the PDF has a reasonable file size", function () {
        stubPdfFileSize = "woof bytes";

        exiftoolModule.ExifTool.prototype.read.restore && exiftoolModule.ExifTool.prototype.read.restore();
        stubExifToolRead = sinon.stub(exiftoolModule.ExifTool.prototype, "read").returns(Promise.resolve({
            PageCount: stubActualPages,
            FileSize: stubPdfFileSize
        }));

        return renderPdf({
            printableHtml: stubPrintableHtml,
            printable: stubPrintable,
            printableDestinationDirectory: stubPrintableDestinationDirectory
        })
            .then(() => {
                throw new Error("Wtf? This should've thrown");
            })
            .catch(error => {
                expect(error.message).to.eql(`Expected PDF to have file size on order of kB, but it is ${stubPdfFileSize} instead`);

                const stubPdfPath = path.join(stubPrintableDestinationDirectory, `${stubPrintable.filename}.pdf`);

                expect(stubExifToolRead.calledOnce).to.be.ok;
                sinon.assert.calledWithExactly(stubExifToolRead, stubPdfPath);

                expect(stubExifToolWrite.notCalled).to.be.ok;
                expect(stubExifToolEnd.notCalled).to.be.ok;
            });
    });
});
