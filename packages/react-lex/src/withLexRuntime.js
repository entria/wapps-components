import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import AWSLexRuntime from 'aws-sdk/clients/lexruntime';
import { CognitoIdentityCredentials } from 'aws-sdk/global';

const propTypes = {
  apiVersion: PropTypes.string,
  region: PropTypes.string,
  botAlias: PropTypes.string,
  botName: PropTypes.string.isRequired,
  userId: PropTypes.string,
  identityPoolId: PropTypes.string.isRequired,
  options: PropTypes.object,
};

const defaultProps = {
  apiVersion: '2016-11-28',
  region: 'us-east-1',
  botAlias: '$LATEST',
  userId: `user_${Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)}`,
  options: {},
};

const getDisplayName = name => `withLexRuntime(${name})`;

const withLexRuntime = WrappedComponent => {
  class LexRuntime extends Component {
    constructor(props) {
      super(props);

      this.credentials = null;
      this.lexruntime = null;
    }

    componentDidMount() {
      const { apiVersion, region, identityPoolId } = this.props;

      this.credentials = new CognitoIdentityCredentials(
        {
          IdentityPoolId: identityPoolId,
        },
        { region },
      );

      this.lexruntime = new AWSLexRuntime({
        apiVersion,
        region,
        credentials: this.credentials,
        ...this.props.options,
      });
    }

    postText = (inputText, sessionAttributes = {}) => {
      const { botAlias, botName, userId } = this.props;

      const params = {
        botAlias,
        botName,
        userId: this.credentials.identityId || userId,
        inputText,
        sessionAttributes,
      };

      return this.lexruntime.postText(params).promise();
    };

    render() {
      return <WrappedComponent postText={this.postText} {...this.props} />;
    }
  }

  const name =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  LexRuntime.displayName = getDisplayName(name);
  LexRuntime.WrappedComponent = WrappedComponent;
  LexRuntime.propTypes = propTypes;
  LexRuntime.defaultProps = defaultProps;

  return hoistStatics(LexRuntime, WrappedComponent);
};

export default withLexRuntime;
