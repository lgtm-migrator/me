import {expect} from "chai";
import {shallow} from "enzyme";
import React from "react";
import LetterSignature from "../../../../../../../src/lib/components/letter/content/signature";
import LetterEntity from "../../../../../../../src/lib/letter";
import LetterSection from "../../../../../../../src/lib/letterSection";

describe("LetterSignature", function () {
    let stubContentConfiguration;
    let stubPersonJs;
    let stubSenderJs;
    let stubRecipientJs;
    let stubLetter;

    beforeEach(function () {
        stubContentConfiguration = LetterSection.fromJS({
            type: "signature"
        });

        stubPersonJs = {
            name: null,
            givenName: "Woof",
            familyName: "Woof",
            worksFor: "Woofs",
            jobTitle: "Woof",
            picture: null,
            email: "woof@randytarampi.ca",
            phone: "+16692216251",
            url: "woof.woof/woof",
            description: "Woof woof woof",
            location: {
                address: "woof",
                postalCode: "meow",
                city: "grr",
                countryCode: "CA",
                region: "BC"
            }
        };
        stubSenderJs = Object.assign({}, stubPersonJs);
        stubRecipientJs = Object.assign({}, stubPersonJs, {givenName: "Meow", email: "meow@randytarampi.ca"});

        stubLetter = LetterEntity.fromJS({
            sender: stubSenderJs,
            recipient: stubRecipientJs,
            id: "foo",
            filename: null,
            content: [],
            renderOptions: {
                format: "bar"
            }
        });
    });

    it("renders", function () {
        const rendered = shallow(<LetterSignature letter={stubLetter}
                                                  contentConfiguration={stubContentConfiguration}/>);

        expect(rendered).to.have.descendants(".letter-signature__content");
        expect(rendered).to.have.descendants(".signature.letter-signature__signature");
        expect(rendered.find(".signature.letter-signature__signature")).to.have.prop("src", `${__LETTER_ASSET_URL__}/signature.svg`);
    });
});
