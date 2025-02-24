import {Photo, Post} from "@randy.tarampi/js";
import {ConnectedError, ConnectedMappedPosts, ConnectedPosts} from "@randy.tarampi/jsx";
import {shallow} from "@randy.tarampi/jsx/test";
import {ConnectedLetter} from "@randy.tarampi/letter";
import {ConnectedResume} from "@randy.tarampi/resume";
import {expect} from "chai";
import {Map} from "immutable";
import React from "react";
import {Redirect} from "react-router";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
    BlogPhotoRouteHandler,
    BlogRouteHandler,
    BlogWordsRouteHandler,
    Error404Handler,
    LetterHandler,
    MainHandler,
    MapPostsHandler,
    MapPostsPhotoRouteHandler,
    MapPostsWordsRouteHandler,
    PhotosRouteHandler,
    ResumeHandler,
    WordsRouteHandler
} from "../../../../src/public/routes";
import Main from "../../../../src/public/views/main";

describe("routes", function () {
    let mockStore;
    let stubMiddleware;
    let stubInitialState;
    let stubStore;

    beforeEach(function () {
        stubMiddleware = [thunk];
        mockStore = configureStore(stubMiddleware);
        stubInitialState = Map();
        stubStore = mockStore(stubInitialState);
    });

    describe("WordsRouteHandler", function () {
        it("renders", function () {
            const rendered = shallow(stubStore)(<WordsRouteHandler/>);

            expect(rendered).to.contain(
                <Redirect to="/blog/words"/>
            );
        });
    });

    describe("PhotosRouteHandler", function () {
        it("renders", function () {
            const rendered = shallow(stubStore)(<PhotosRouteHandler/>);

            expect(rendered).to.contain(
                <Redirect to="/blog/photos"/>
            );
        });
    });

    describe("BlogRouteHandler", function () {
        it("renders", function () {
            const rendered = shallow(stubStore)(<BlogRouteHandler/>);

            expect(rendered).to.contain(
                <ConnectedPosts fetchUrl={`${__POSTS_SERVICE_URL__}`}/>
            );
        });
    });

    describe("BlogPhotoRouteHandler", function () {
        it("renders", function () {
            const rendered = shallow(stubStore)(<BlogPhotoRouteHandler/>);

            expect(rendered).to.contain(
                <BlogRouteHandler fetchUrl={`${__POSTS_SERVICE_URL__}`} type={Photo.type}/>
            );
        });
    });

    describe("BlogWordsRouteHandler", function () {
        it("renders", function () {
            const rendered = shallow(stubStore)(<BlogWordsRouteHandler/>);

            expect(rendered).to.contain(
                <BlogRouteHandler fetchUrl={`${__POSTS_SERVICE_URL__}`} type={Post.type}/>
            );
        });
    });

    describe("MapPostsHandler", function () {
        it("renders", function () {
            const rendered = shallow(stubStore)(<MapPostsHandler/>);

            expect(rendered).to.contain(
                <ConnectedMappedPosts
                    fetchUrl={`${__POSTS_SERVICE_URL__}`}
                    id="map-posts"
                    mapContainerHeight="calc(100vh - 48px)"
                />
            );
        });
    });

    describe("MapPostsPhotoRouteHandler", function () {
        it("renders", function () {
            const rendered = shallow(stubStore)(<MapPostsPhotoRouteHandler/>);

            expect(rendered).to.contain(
                <MapPostsHandler fetchUrl={`${__POSTS_SERVICE_URL__}`} type={Photo.type}/>
            );
        });
    });

    describe("MapPostsWordsRouteHandler", function () {
        it("renders", function () {
            const rendered = shallow(stubStore)(<MapPostsWordsRouteHandler/>);

            expect(rendered).to.contain(
                <MapPostsHandler fetchUrl={`${__POSTS_SERVICE_URL__}`} type={Post.type}/>
            );
        });
    });

    describe("LetterHandler", function () {
        it("renders", function () {
            const stubProps = {woof: "meow"};
            const rendered = shallow(stubStore)(<LetterHandler {...stubProps}/>);

            expect(rendered).to.contain(
                <ConnectedLetter {...stubProps}/>
            );
        });
    });

    describe("ResumeHandler", function () {
        it("renders", function () {
            const stubProps = {woof: "meow"};
            const rendered = shallow(stubStore)(<ResumeHandler {...stubProps}/>);

            expect(rendered).to.contain(
                <ConnectedResume {...stubProps}/>
            );
        });
    });

    describe("MainHandler", function () {
        it("renders", function () {
            const stubProps = {woof: "meow"};
            const rendered = shallow(stubStore)(<MainHandler {...stubProps}/>);

            expect(rendered).to.contain(
                <Main {...stubProps}/>
            );
        });
    });

    describe("Error404Handler", function () {
        it("renders", function () {
            const stubProps = {woof: "meow"};
            const rendered = shallow(stubStore)(<Error404Handler {...stubProps}/>);

            expect(rendered).to.contain(
                <ConnectedError errorCode={404} {...stubProps}/>
            );
        });
    });
});

