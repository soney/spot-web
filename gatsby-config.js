module.exports = {
    // pathPrefix: `/spot-web`,
    siteMetadata: {
        title: `spot group`,
        author: `Steve Oney`
    },
    graphqlTypegen: true,
    plugins: [
        // Add typescript stack into webpack
        `gatsby-plugin-typescript`,
        {
            resolve: `gatsby-source-strapi`,
            options: {
                version: 5,
                apiURL: 'https://mspot.link',
                collectionTypes: ['author', 'publication', 'venue', 'cluster', 'blogpost', 'newsitem'],
                singleTypes: ['group', 'leadcv'],
                queryLimit: 1000
            }
        },
        // `gatsby-plugin-graphql-codegen`,
        `gatsby-plugin-lodash`,
        `gatsby-plugin-sass`,
        {
            resolve: `gatsby-plugin-google-fonts`,
            options: {
                fonts: [
                    `Alegreya`
                ]
            }
        },
        `gatsby-transformer-sharp`,
        `gatsby-transformer-remark`,
        `gatsby-plugin-image`,
        `gatsby-plugin-sharp`,
        `gatsby-transformer-sharp`, // Needed for dynamic images
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `pages`,
                path: `${__dirname}/src/pages/`,
            },
        },
    ],
}
