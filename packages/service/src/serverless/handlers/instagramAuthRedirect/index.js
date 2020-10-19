import {responseBuilder} from "@randy.tarampi/serverless";
import logger from "../../logger";
import configureEnvironment from "../../util/configureEnvironment";
import returnErrorResponse from "../../util/response/returnErrorResponse";

export default (event, context, callback) => {
    logger.debug("%s@%s handling request %s", context.functionName, context.functionVersion, context.awsRequestId, event, context);

    configureEnvironment()
        .then(() => {
            callback(null, responseBuilder(null, 302, {
                Location: `https://api.instagram.com/oauth/authorize/?client_id=${process.env.INSTAGRAM_API_KEY}&redirect_uri=${encodeURIComponent(process.env.INSTAGRAM_AUTH_CALLBACK_URI)}&response_type=code&scope=user_profile,user_media`
            }));
        })
        .catch(returnErrorResponse(event, context, callback));
};
