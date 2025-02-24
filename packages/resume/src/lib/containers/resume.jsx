import {createIsLoadingUrlSelector} from "@randy.tarampi/jsx";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {fetchResumeCreator} from "../actions";
import {buildFetchUrlForVariant} from "../api";
import {ResumeComponent} from "../components/resume";
import selectors from "../data/selectors";

let allResumeCustomContent = {};

try {
    allResumeCustomContent = require("../../resume-custom-content");
} catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") {
        throw error;
    }
}

export const ConnectedResume = connect(
    (state, ownProps) => {
        const isLoadingUrlSelector = createIsLoadingUrlSelector();
        const variant = ownProps.match.params.variant || "resume";
        const fetchUrl = ownProps.fetchUrl || buildFetchUrlForVariant(variant);
        const props = {
            resume: ownProps.resume || selectors.getResumeVariant(state, variant),
            isLoading: isLoadingUrlSelector(state, fetchUrl) || false,
            variant
        };

        let customContent;

        if (ownProps.resume) {
            if (ownProps.resume.customContent) {
                customContent = ownProps.resume.customContent;
            } else if (ownProps.resume.id) {
                customContent = allResumeCustomContent[ownProps.resume.id];
            } else {
                customContent = allResumeCustomContent[variant];
            }
        } else {
            customContent = allResumeCustomContent[variant];
        }

        if (customContent) {
            props.customContent = customContent;
        }

        return props;
    },
    dispatch => {
        return {
            fetchResume: variant => dispatch(fetchResumeCreator(variant))
        };
    }
)(ResumeComponent);

ConnectedResume.propTypes = {
    match: PropTypes.object.isRequired
};

export default ConnectedResume;
