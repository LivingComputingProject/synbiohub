
var getComponentDefinition = require('../../lib/get-sbol').getComponentDefinition

var sbolmeta = require('sbolmeta')

var base64 = require('../base64')

exports = module.exports = function(req, res) {

    var stack = require('../../lib/stack')()

    stack.getPrefixes((err, prefixes) => {

        var baseUri
        var uri

        if(req.params.designURI) {
            uri = base64.decode(req.params.designURI)
        } else {
            baseUri = prefixes[req.params.prefix]
            uri = baseUri + req.params.designid
        }

        getComponentDefinition(null, uri, [ stack.getDefaultStore(), req.userStore ], function(err, sbol, componentDefinition) {

            if(err) {

                res.status(500).send(err)

            } else {

                if(!componentDefinition) {
                    return res.status(404).send('not found\n' + uri)
                }

                console.log('sbol is ' + sbol)

                try {
                res.status(200)
                   .type('application/json')
                   .send(JSON.stringify(sbolmeta.summarizeDocument(sbol), null, 2))
                }catch(e) {
                res.status(500).send(e.stack)
                }

            }

        });

    })

};


