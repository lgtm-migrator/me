import {
    BlogAppLink,
    CampaignLink,
    ConnectedHelloBear,
    EmailLink,
    GitHubLink,
    InstagramLink,
    LinkedInLink,
    ResumeAppLink,
    RowBlock,
    SmsLink
} from "@randy.tarampi/jsx";
import React, {Fragment} from "react";
import {Col} from "react-materialize";

export const IntroText = () =>
    <Fragment>
        <h2>
            <span className="text">Hey!</span>
        </h2>
        <p>
            I'm looking more for a mortgage than a job right now, but you probably think otherwise 'cause let's be real,
            you probably clicked through to here from my <ResumeAppLink>resume</ResumeAppLink> or my <LinkedInLink useBranding={false} text="LinkedIn"/>.
        </p>
        <p>
            If you're interested in my work check me out on <GitHubLink useBranding={false} text="GitHub"/>, look at
            where I've been on <InstagramLink useBranding={false} text="Instagram"/> or peek in on what's going on in my
            life at my <BlogAppLink text="blog"/>. I've even got an <CampaignLink useBranding={false} className="link--rss" text="RSS feed" href={__POSTS_FEED_URL__}/>!
        </p>
        <p>
            And if you're still interested after all that, shoot me an <EmailLink useBranding={false} text="email" subject="Hey!" body="I bothered to click on the email link..."/> or <SmsLink useBranding={false} text="text" body="Hey!"/> and let's have a chat!
        </p>
    </Fragment>;

export const Intro = () =>
    <Fragment>
        <RowBlock name="intro" className="intro--large hide-on-med-and-down">
            <Col className="block__bear" l={5} s={12}>
                <ConnectedHelloBear id="intro-hello-bear" htmlId="intro-large-hello-bear"/>
            </Col>
            <Col className="block__text" l={7}>
                <IntroText/>
            </Col>
        </RowBlock>
        <RowBlock name="intro-responsive-bear" className="intro-responsive-bear hide-on-large-only">
            <Col className="block__bear" l={5} s={12}>
                <ConnectedHelloBear id="intro-hello-bear" htmlId="intro-responsive-hello-bear"/>
            </Col>
        </RowBlock>
        <RowBlock name="intro-responsive-text" className="intro-responsive-text hide-on-large-only">
            <Col className="block__text" s={12}>
                <IntroText/>
            </Col>
        </RowBlock>
    </Fragment>;


export default Intro;
