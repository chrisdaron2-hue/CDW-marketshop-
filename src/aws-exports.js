const awsConfig = {
  Auth: {
    Cognito: {
      region: "us-east-1",
      userPoolId: "us-east-1_vk65AJSaU",
      userPoolClientId: "47289jp3e520qvch59jeuhf5ev",
      loginWith: {
        email: true,
      },
    },
  },
};

export default awsConfig;