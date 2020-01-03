module.exports = {
    pathPrefix: `/spot-web`,
    siteMetadata: {
        title: `spot group`,
        author: `Steve Oney`
    },
    plugins: [
        `gatsby-plugin-react-helmet`,
        // Add typescript stack into webpack
        `gatsby-plugin-typescript`,
        {
            resolve: `gatsby-source-strapi`,
            options: {
                apiURL: 'http://localhost:1337',
                contentTypes: [
                    'author',
                    'publication',
                    'venue'
                ],
                queryLimit: 1000
            }
        },
        `gatsby-plugin-graphql-codegen`,
        `gatsby-plugin-lodash`,
        `gatsby-plugin-sharp`,
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sass`,
        {
            resolve: `gatsby-plugin-google-fonts`,
            options: {
                fonts: [
                    `Alegreya`
                ]
            }
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `pages`,
                path: `${__dirname}/src/pages/`,
            },
        },
    ],
}
