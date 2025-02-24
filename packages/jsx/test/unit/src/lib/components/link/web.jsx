import {expect} from "chai";
import {shallow} from "enzyme";
import React from "react";
import CampaignLink from "../../../../../../src/lib/components/link/campaign";
import WebLink from "../../../../../../src/lib/components/link/web";

describe("WebLink", function () {
    it("renders (href with branding)", function () {
        const stubProps = {
            href: "/woof",
            text: "WOOF"
        };
        const rendered = shallow(<WebLink {...stubProps}/>);

        expect(rendered).to.containMatchingElement(
            <CampaignLink
                className="link--web"
                href={stubProps.href}
                text={stubProps.text}
            />
        );
    });

    it("renders (href without branding)", function () {
        const stubProps = {
            href: "/woof",
            text: "WOOF",
            useBranding: false
        };
        const rendered = shallow(<WebLink {...stubProps}/>);

        expect(rendered).to.containMatchingElement(
            <CampaignLink
                className="link--web link--no-branding"
                href={stubProps.href}
                text={stubProps.text}
            />
        );
    });

    it("renders (no text)", function () {
        const stubProps = {
            href: "/woof",
            useBranding: false
        };
        const rendered = shallow(<WebLink {...stubProps}/>);

        expect(rendered).to.containMatchingElement(
            <CampaignLink
                className="link--web link--no-branding"
                href={stubProps.href}
                text={stubProps.href}
            />
        );
    });
});
