import { ApolloServerPlugin, BaseContext } from '@apollo/server';

export function createApolloSandboxPlugin(): ApolloServerPlugin<BaseContext> {
  return {
    async serverWillStart() {
      return {
        async renderLandingPage() {
          const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Apollo Sandbox | Digital Business Card</title>
    <style>
      body {
        margin: 0;
        overflow: hidden;
        background: #07050c;
      }
      #embeddableSandbox {
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
      }
    </style>
  </head>
  <body>
    <div id="embeddableSandbox"></div>
    <script src="https://embeddable-sandbox.cdn.apollographql.com/v2/embeddable-sandbox.umd.production.min.js"></script>
    <script>
      (function () {
        var params = new URLSearchParams(window.location.search);
        var lang = params.get('lang') === 'RU' ? 'RU' : 'EN';
        var strategy = params.get('strategy') === 'AST_JOIN' ? 'AST_JOIN' : 'DATALOADER';

        var defaultDocument =
          'query GetDigitalCard($lang: Language! = ' + lang + ', $strategy: OptimizationStrategy! = ' + strategy + ') {\\n' +
          '  profile(lang: $lang, strategy: $strategy) {\\n' +
          '    name\\n' +
          '    title\\n' +
          '    description\\n' +
          '    location\\n' +
          '    links {\\n' +
          '      platform\\n' +
          '      url\\n' +
          '    }\\n' +
          '    skills {\\n' +
          '      category\\n' +
          '      name\\n' +
          '    }\\n' +
          '    experience {\\n' +
          '      company\\n' +
          '      position\\n' +
          '      period\\n' +
          '      achievements\\n' +
          '    }\\n' +
          '    projects {\\n' +
          '      name\\n' +
          '      description\\n' +
          '      url\\n' +
          '      techStack\\n' +
          '      isNda\\n' +
          '    }\\n' +
          '    certifications {\\n' +
          '      code\\n' +
          '      title\\n' +
          '      issuer\\n' +
          '      year\\n' +
          '    }\\n' +
          '  }\\n' +
          '}';

        new window.EmbeddedSandbox({
          target: '#embeddableSandbox',
          initialEndpoint: window.location.origin + '/graphql',
          endpointIsEditable: false,
          initialState: {
            document: defaultDocument,
            variables: {
              lang: lang,
              strategy: strategy,
            },
            pollForSchemaUpdates: false,
          },
        });
      })();
    </script>
  </body>
</html>`;
          return { html };
        },
      };
    },
  };
}
