---
title: Datadog Serverless Plugin
kind: documentation
aliases:
  - /serverless/serverless_integrations/plugin/
dependencies: ["https://github.com/DataDog/serverless-plugin-datadog/blob/master/README.md"]
---

![build](https://github.com/DataDog/serverless-plugin-datadog/workflows/build/badge.svg)
[![Code Coverage](https://img.shields.io/codecov/c/github/DataDog/serverless-plugin-datadog)](https://codecov.io/gh/DataDog/serverless-plugin-datadog)
[![NPM](https://img.shields.io/npm/v/serverless-plugin-datadog)](https://www.npmjs.com/package/serverless-plugin-datadog)
[![Slack](https://chat.datadoghq.com/badge.svg?bg=632CA6)](https://chat.datadoghq.com/)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](https://github.com/DataDog/serverless-plugin-datadog/blob/master/LICENSE)

Datadog recommends the Serverless Framework Plugin for developers using the Serverless Framework to deploy their serverless applications.
The plugin automatically enables instrumentation for your Python and Node.js applications to collect metrics, traces, and logs by:

- Installing the Datadog Lambda library to your Lambda functions as a Lambda layer.
- Installing the Datadog Lambda Extension to your Lambda functions as a Lambda layer (`addExtension`) or subscribing the Datadog Forwarder to your Lambda functions' log groups (`forwarderArn`).
- Making the required configuration changes, such as adding environment variables, to your Lambda functions.

## Getting started

To quickly get started, follow the installation instructions for [Python][1] or [Node.js][2], and view your function's enhanced metrics, traces, and logs in Datadog. These instructions will get you a basic working setup.

## Upgrade

Each version of the plugin is published with a [specific set of versions of the Datadog Lambda layers][11]. To pick up new features and bug fixes provided by the latest versions of Datadog Lambda layers, upgrade the serverless framework plugin. Test the new version before applying it on your production applications.

## More configuration options

To further configure your plugin, use the following custom parameters in your `serverless.yml`:

| Parameter                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `flushMetricsToLogs`        | Send custom metrics by using logs with the Datadog Forwarder Lambda function (recommended). Defaults to `true`. If you disable this parameter, it's required to set `apiKey` (or `apiKMSKey` if encrypted). `flushMetricsToLogs` is ignored when `addExtension` is true.                                                                                                                                                                 |
| `site`                      | Set which Datadog site to send data, this is only used when `flushMetricsToLogs` is `false` or `addExtension` is `true`. Possible values are `datadoghq.com`, `datadoghq.eu`, `us3.datadoghq.com`, `us5.datadoghq.com`, and `ddog-gov.com`. The default is `datadoghq.com`.                                                                                                                                                              |
| `apiKey`                    | Datadog API Key, only needed when `flushMetricsToLogs` is `false` or `addExtension` is `true`. Defining `apiKey` will add the Datadog API key directly to your Lambda functions as an environment variable. For more information about getting a Datadog API key, see the [API key documentation][3].                                                                                                                                    |
| `apiKMSKey`                 | Datadog API Key encrypted using KMS. Use this parameter in place of `apiKey` when `flushMetricsToLogs` is `false` or `addExtension` is `true`, and you are using KMS encryption. Defining `apiKMSKey` will add the Datadog API Key directly to your Lambda functions as an environment variable.                                                                                                                                         |
| `captureLambdaPayload`      | (Experimental) This optional setting configures Datadog ingestion for incoming and outgoing AWS Lambda payloads. Function request and response values are added as part of outgoing APM spans sent to Datadog, and require Datadog APM to be configured on your function. Obfuscation of fields in the Lambda payload is available via the `replace_tags` block within `apm_config` settings in [datadog.yaml.][12] Defaults to `false`. |
| `monitorsApiKey`            | Datadog API Key. Only needed when using plugin to create monitors for your functions and when `monitors` is defined. Separate from `apiKey` with your function, `monitorsApiKey` is only used to create monitors through the Datadog Monitors API. You may use the same API key for both `apiKey` and `monitorsApiKey`.                                                                                                                  |
| `monitorsAppKey`            | Datadog Application Key. Only needed when using plugin to create monitors for your function and when `monitors` is defined.                                                                                                                                                                                                                                                                                                              |
| `addLayers`                 | Whether to install the Datadog Lambda library as a layer. Defaults to `true`. Set to `false` when you plan to package the Datadog Lambda library to your function's deployment package on your own so that you can install a specific version of the Datadog Lambda library ([Python][4] or [Node.js][5]).                                                                                                                               |
| `addExtension`              | Whether to install the Datadog Lambda Extension as a layer. Defaults to `false`. When enabled, it's required to set the `apiKey` (or `apiKMSKey`) parameter. Learn more about the Lambda Extension Layer [here][8]. Note: AWS only supports Lambda Extensions for [certain runtimes][9].                                                                                                                                                 |
| `logLevel`                  | The log level, set to `DEBUG` for extended logging.                                                                                                                                                                                                                                                                                                                                                                                      |
| `enableXrayTracing`         | Set `true` to enable X-Ray tracing on the Lambda functions and API Gateway integrations. Defaults to `false`.                                                                                                                                                                                                                                                                                                                            |
| `enableDDTracing`           | Enable Datadog tracing on the Lambda function. Note: This applies only to integrations using the Datadog Extension. Defaults to `true`.                                                                                                                                                                                                                                                                                                  |
| `enableDDLogs`              | Enable Datadog log collection for the Lambda function. Note: This setting has no effect on logs sent via the Datadog Forwarder. Defaults to `true`.                                                                                                                                                                                                                                                                                      |
| `subscribeToApiGatewayLogs` | Enable automatic subscription of the Datadog Forwarder to API Gateway log groups. Defaults to `true`.                                                                                                                                                                                                                                                                                                                                    |
| `subscribeToHttpApiLogs`    | Enable automatic subscription of the Datadog Forwarder to Http-api log groups. Defaults to `true`.                                                                                                                                                                                                                                                                                                                                       |
| `subscribeToWebsocketLogs`  | Enable automatic subscription of the Datadog Forwarder to Websocket log groups. Defaults to `true`.                                                                                                                                                                                                                                                                                                                                      |
| `forwarderArn`              | Setting this parameter subscribes the given Datadog forwarder to the Lambda functions’ CloudWatch log groups. Required when `enableDDTracing` is set to `true` unless the subscription is otherwise applied. For example, if a Datadog Forwarder subscription is applied via Datadog's AWS Integration, then `forwarderArn` is not required.                                                                                             |
| `integrationTesting`        | Set `true` when running integration tests. This will bypass the validation of the Forwarder ARN and the addition of Datadog Monitor output links. Defaults to `false`.                                                                                                                                                                                                                                                                   |
| `enableTags`                | When set, automatically tag the Lambda functions with the `service` and `env` tags using the `service` and `stage` values from the serverless application definition. It does NOT override if a `service` or `env` tag already exists. Defaults to `true`.                                                                                                                                                                               |
| `injectLogContext`          | When set, the lambda layer will automatically patch console.log with Datadog's tracing ids. Defaults to `true`.                                                                                                                                                                                                                                                                                                                          |
| `exclude`                   | When set, this plugin will ignore all specified functions. Use this parameter if you have any functions that should not include Datadog functionality. Defaults to `[]`.                                                                                                                                                                                                                                                                 |
| `enabled`                   | When set to false, the Datadog plugin will stay inactive. Defaults to `true`. You can control this option using an environment variable, e.g. `enabled: ${strToBool(${env:DD_PLUGIN_ENABLED, true})}`, to activate/deactivate the plugin during deployment. Alternatively, you can also use the value passed in through `--stage` to control this option, [see example.](#disable-plugin-for-particular-environment)                     |
| `monitors`                  | When defined, the Datadog plugin will configure monitors for the deployed function. You must also have `monitorsApiKey` and `monitorsAppKey` defined. To learn how to define monitors, see [To Enable and Configure a Recommended Serverless Monitor.](#to-enable-and-configure-a-recommended-serverless-monitor)                                                                                                                        |
| `customHandler`             | When set, the specified handler is set as the handler for all the functions. By deafult, the handler is set to `/opt/nodejs/node_modules/datadog-lambda-js/handler.handler` if `addLayers` is set to `true`, or `node_modules/datadog-lambda-js/dist/handler.handler` if `addLayers` is set to `false`                                                                                                                                   |

To use any of these parameters, add a `custom` > `datadog` section to your `serverless.yml` similar to this example:

```yaml
custom:
  datadog:
    flushMetricsToLogs: true
    apiKey: "{Datadog_API_Key}"
    apiKMSKey: "{Encrypted_Datadog_API_Key}"
    monitorsApiKey: "{Datadog_API_Key}"
    monitorsAppKey: "{Datadog_Application_Key}"
    addLayers: true
    logLevel: "info"
    enableXrayTracing: false
    enableDDTracing: true
    enableDDLogs: true
    subscribeToAccessLogs: true
    forwarderArn: arn:aws:lambda:us-east-1:000000000000:function:datadog-forwarder
    enableTags: true
    injectLogContext: true
    exclude:
      - dd-excluded-function
```

**Note**: If you use webpack, Datadog recommends using the prebuilt layers by setting `addLayers` to `true`, which is the default, and add `datadog-lambda-js` and `dd-trace` to the [externals][6] section of your webpack config.

### TypeScript

If you are using serverless-typescript, make sure that `serverless-datadog` is above the `serverless-typescript` entry in your `serverless.yml`. The plugin will automatically detect `.ts` files.

```yaml
plugins:
  - serverless-plugin-datadog
  - serverless-typescript
```

If you use TypeScript, you may encounter the error of missing type definitions. A missing type definition happens when you use the prebuilt layers (for example, set `addLayers` to `true`, which is the default) and need to import helper functions from the `datadog-lambda-js` and `dd-trace` packages to submit custom metrics or instrument a specific function. To resolve the error, add `datadog-lambda-js` and `dd-trace` to the `devDependencies` list of your project's package.json.

### Webpack

`dd-trace` is known to be not compatible with webpack due to the use of conditional import and other issues. If using webpack, make sure to mark `datadog-lambda-js` and `dd-trace` as [externals](https://webpack.js.org/configuration/externals/) for webpack, so webpack knows these dependencies will be available in the runtime. You should also remove `datadog-lambda-js` and `dd-trace` from `package.json` and the build process to ensure you're using the versions provided by the Datadog Lambda Layer.

#### serverless-webpack

If using `serverless-webpack`, make sure to also exclude `datadog-lambda-js` and `dd-trace` in your `serverless.yml` in addition to declaring them as external in your webpack config file.

**webpack.config.js**

```javascript
var nodeExternals = require("webpack-node-externals");

module.exports = {
  // we use webpack-node-externals to excludes all node deps.
  // You can manually set the externals too.
  externals: [nodeExternals(), "dd-trace", "datadog-lambda-js"],
};
```

**serverless.yml**

```yaml
custom:
  webpack:
    includeModules:
      forceExclude:
        - dd-trace
        - datadog-lambda-js
```

### Forwarder

The [Datadog Forwarder Lambda function][7] needs to be installed and subscribed to your Lambda functions' log groups. The plugin automatically creates the log subscriptions when the Forwarder's ARN is supplied via the `forwarderArn` option.

If you run into the following error, double check the supplied Forwarder ARN is correct and ensure it is from the same region and account where your serverless application is deployed.

```
An error occurred: GetaccountapiLogGroupSubscription - Could not execute the lambda function. Make sure you have given CloudWatch Logs permission to execute your function. (Service: AWSLogs; Status Code: 400; Error Code: InvalidParameterException).
```

### Disable Plugin for Particular Environment

If you'd like to turn off the plugin based on the environment (passed via `--stage`), you can use something similar to the example below.

```yaml
provider:
  stage: ${self:opt.stage, 'dev'}

custom:
  staged: ${self:custom.stageVars.${self:provider.stage}, {}}

  stageVars:
    dev:
      dd_enabled: false

  datadog:
    enabled: ${self:custom.staged.dd_enabled, true}
```

### Serverless Monitors

There are seven recommended monitors with default values pre-configured.

|       Monitor        |                                         Metrics                                          | Threshold  | Serverless Monitor ID  |
| :------------------: | :--------------------------------------------------------------------------------------: | :--------: | :--------------------: |
|   High Error Rate    |                       `aws.lambda.errors`/`aws.lambda.invocations`                       |   >= 10%   |   `high_error_rate`    |
|       Timeout        |                      `aws.lambda.duration.max`/`aws.lambda.timeout`                      |    >= 1    |       `timeout`        |
|    Out of Memory     |                           `aws.lambda.enhanced.out_of_memory`                            |    > 0     |    `out_of_memory`     |
|  High Iterator Age   |                            `aws.lambda.iterator_age.maximum`                             | >= 24 hrs  |  `high_iterator_age`   |
| High Cold Start Rate | `aws.lambda.enhanced.invocations(cold_start:true)`/<br>`aws.lambda.enhanced.invocations` |   >= 20%   | `high_cold_start_rate` |
|    High Throttles    |                     `aws.lambda.throttles`/`aws.lambda.invocations`                      |   >= 20%   |    `high_throttles`    |
|    Increased Cost    |                           `aws.lambda.enhanced.estimated_cost`                           | &#8593;20% |    `increased_cost`    |

#### To Enable and Configure a Recommended Serverless Monitor

To create a recommended monitor, you must use its respective serverless monitor ID. Note that you must also set the `monitorApiKey` and `monitorAppKey`.

If you’d like to further configure the parameters for a recommended monitor, you can directly define the parameter values below the serverless monitor ID. Parameters not specified under a recommended monitor will use the default recommended value. The `query` parameter for recommended monitors cannot be directly modified and will default to using the `query` valued as defined above; however, you may change the threshold value in `query` by re-defining it within the `options` parameter. To delete a monitor, remove the monitor from the `serverless.yml` template. For further documentation on how to define monitor parameters, see the [Datadog Monitors API](https://docs.datadoghq.com/api/latest/monitors/#create-a-monitor).

Monitor creation occurs after the function is deployed. In the event that a monitor is unsuccessfully created, the function will still be successfully deployed.

##### To create a recommended monitor with the default values

Define the appropriate serverless monitor ID without specifying any parameter values

```yaml
custom:
  datadog:
    addLayers: true
    monitorsApiKey: "{Datadog_API_Key}"
    monitorsAppKey: "{Datadog_APP_Key}"
    monitors:
      - high_error_rate:
```

##### To configure a recommended monitor

```yaml
custom:
 datadog:
   addLayers: true
   monitorsApiKey: "{Datadog_API_Key}"
   monitorsAppKey: "{Datadog_APP_Key}"
   monitors:
     - high_error_rate:
        name: "High Error Rate with Modified Warning Threshold"
        message: "More than 10% of the function’s invocations were errors in the selected time range. Notify @data.dog@datadoghq.com @slack-serverless-monitors"
        tags: ["modified_error_rate", "serverless", "error_rate"]
        require_full_window: true
        priority: 2
        options: {
          include_tags: true
          notify_audit:true
          thresholds: {
            ok: 0.025
            warning: 0.05
          }
        }
```

##### To delete a monitor

Removing the serverless monitor ID and its parameters will delete the monitor.

#### To Enable and Configure a Custom Monitor

To define a custom monitor, you must define a unique serverless monitor ID string in addition to passing in the API key and Application key. The `query` parameter is required but every other parameter is optional. Define a unique serverless monitor ID string and specify the necessary parameters below. For further documentation on monitor parameters, see the [Datadog Monitors API](https://docs.datadoghq.com/api/latest/monitors/#create-a-monitor).

```yaml
custom:
  datadog:
    addLayers: true
    monitorsApiKey: "{Datadog_API_Key}"
    monitorsAppKey: "{Datadog_APP_Key}"
    monitors:
      - custom_monitor_id:
          name: "Custom Monitor"
          query: "max(next_1w):forecast(avg:system.load.1{*}, 'linear', 1, interval='60m', history='1w', model='default') >= 3"
          message: "Custom message for custom monitor. Notify @data.dog@datadoghq.com @slack-serverless-monitors"
          tags: ["custom_monitor", "serverless"]
          priority: 3
          options: {
            enable_logs_sample: true
            require_full_window: true
            include_tags: false
            notify_audit:true
            notify_no_data: false
            thresholds: {
              ok: 1
              warning: 2
            }
          }
```

## Opening Issues

If you encounter a bug with this package, let us know by filing an issue! Before opening a new issue, please search the existing issues to avoid duplicates.

When opening an issue, include your Serverless Framework version, Python/Node.js version, and stack trace if available. Also, please include the steps to reproduce when appropriate.

You can also open an issue for a feature request.

## Contributing

If you find an issue with this package and have a fix, please feel free to open a pull request following the [procedures][10].

## Community

For product feedback and questions, join the `#serverless` channel in the [Datadog community on Slack](https://chat.datadoghq.com/).

## License

Unless explicitly stated otherwise, all files in this repository are licensed under the Apache License Version 2.0.

This product includes software developed at Datadog (<https://www.datadoghq.com/>). Copyright 2021 Datadog, Inc.

[1]: https://docs.datadoghq.com/serverless/installation/python/?tab=serverlessframework
[2]: https://docs.datadoghq.com/serverless/installation/nodejs/?tab=serverlessframework
[3]: https://docs.datadoghq.com/account_management/api-app-keys/#api-keys
[4]: https://pypi.org/project/datadog-lambda/
[5]: https://www.npmjs.com/package/datadog-lambda-js
[6]: https://webpack.js.org/configuration/externals/
[7]: https://docs.datadoghq.com/serverless/forwarder/
[8]: https://docs.datadoghq.com/serverless/datadog_lambda_library/extension/
[9]: https://docs.aws.amazon.com/lambda/latest/dg/using-extensions.html
[10]: https://github.com/DataDog/serverless-plugin-datadog/blob/master/CONTRIBUTING.md
[11]: https://github.com/DataDog/serverless-plugin-datadog/blob/master/src/layers.json
[12]: https://docs.datadoghq.com/tracing/setup_overview/configure_data_security/?tab=mongodb#replace-rules-for-tag-filtering
