const express = require('express')
const next = require('next')

const favicon = require('serve-favicon')
var path = require('path')
let https = require('https')
let fs = require('fs')

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

nextApp.prepare()
    .then(() => {

        let server = express(), options = {}, PORT = 3000, app = express()

        if (dev) {
            // DEVELOPMENT ///

            // DEVELOPMENT ///  
        }
        else {
            // PRODUCTION ///

            // options = {
            //     ...options,
            //     key: fs.readFileSync('/etc/letsencrypt/live/rl.pravasdesign.com/privkey.pem', 'utf-8'),
            //     cert: fs.readFileSync('/etc/letsencrypt/live/rl.pravasdesign.com/fullchain.pem', 'utf-8'),
            // }
            // PRODUCTION ///
        }

        server.use(favicon(path.join(__dirname, "/favicon.ico")))

        server.get('/', (req, res) => {
            const actualPage = '/';
            nextApp.render(req, res, actualPage);
        });

        server.get('/submit-design', (req, res) => {
            const actualPage = '/submit-design';
            nextApp.render(req, res, actualPage);
        });

        server.get('/checkout-details', (req, res) => {
            const actualPage = '/checkout-details';
            nextApp.render(req, res, actualPage);
        });

        server.get('/my-orders', (req, res) => {
            const actualPage = '/my-orders';
            nextApp.render(req, res, actualPage);
        });

        server.get('/vendor/:vName/:vId', (req, res) => {
            const actualPage = '/vendor-shared-link';
            const queryParams = {
                vName: req.params.vName,
                vId: req.params.vId
            };
            nextApp.render(req, res, actualPage, queryParams);
        });

        server.get('/products/:catName/:subCatName/:prodTypeName/:fetchId', (req, res) => {
            const actualPage = '/products-segregated';
            const queryParams = {
                catName: req.params.catName,
                subCatName: req.params.subCatName,
                prodTypeName: req.params.prodTypeName,
                fetchId: req.params.fetchId
            };
            nextApp.render(req, res, actualPage, queryParams);
        });

        server.get('/product-detail/:catName/:subCatName/:prodTypeName/:fetchId', (req, res) => {
            const actualPage = '/product-detail';
            const queryParams = {
                catName: req.params.catName,
                subCatName: req.params.subCatName,
                prodTypeName: req.params.prodTypeName,
                fetchId: req.params.fetchId,
            };
            nextApp.render(req, res, actualPage, queryParams);
        });

        server.get('*', (req, res) => {
            const actualPage = '/not-found';

            nextApp.render(req, res, actualPage);
            // return handle(req, res)
        });


        server.listen((PORT), (err) => {
            if (err) throw err
            console.log('>> Ready on ' + PORT)
        })


        // if(dev){
        //     // DEVELOPMENT ///
        //     server.listen((PORT), (err) => { 
        //         if (err) throw err
        //         console.log('>> Ready on ' + PORT)
        //     })
        //     // DEVELOPMENT ///
        // }
        // else{
        //     // PRODUCTION ///
        //     app = https.createServer(options, server)
        //     .listen(
        //         PORT,
        //         function(){
        //             console.log("Express server listening on port " + PORT)
        //         }
        //     )

        //     app.on('listening',function(){
        //         console.log('ok, server is running')
        //     })
        //     // PRODUCTION ///
        // }

    })

    .catch((ex) => {
        console.error(ex.stack)
        process.exit(1)
    })