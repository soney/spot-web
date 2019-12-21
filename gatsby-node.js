/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');

const makeRequest = (graphql, request) => new Promise((resolve, reject) => {
    resolve(
        graphql(request).then(result => {
            if(result.errors) {
                reject(result.errors);
            }
            return result;
        })
    );
});

exports.createPages = ({ actions, graphql }) => {
    const { createPage } = actions;
    const getAuthors = makeRequest(graphql, `
        {
            allStrapiAuthor(filter: {membership: {in: ["lead", "member"]}}) {
                nodes {
                    id
                    strapiId
                    given_name
                    family_name
                }
            }
            allStrapiPublication {
                nodes {
                    id
                    title
                    authors {
                        id
                        given_name
                        family_name
                    }
                    venue_year {
                        id
                        location
                        venue
                        year
                    }
                }
            }
            allStrapiVenue {
                nodes {
                    id,
                    strapiId
                    long_name
                    short_name
                    type
                }
            }
    }
`).then(result => {
    result.data.allStrapiAuthor.nodes.forEach(( node ) => {
        const authorPubs = result.data.allStrapiPublication.nodes.filter((pn) => {
            const authors = pn.authors;
            return authors.some((a) => a.id===node.strapiId)
        });
        createPage({
            path: `/${node.given_name}_${node.family_name}`,
            component: path.resolve(`src/pages/member.tsx`),
            context: {
                id: node.id,
                pubs: authorPubs
            }
        });
    });
    result.data.allStrapiPublication.nodes.forEach(( node ) => {
        let venue_short_name;
        let year;
        if(node.venue_year) {
            const matchingVenues = result.data.allStrapiVenue.nodes.filter((v) => v.strapiId===node.venue_year.venue);
            if(matchingVenues.length > 0) {
                const venue = matchingVenues[0];
                venue_short_name = venue.short_name;
            }
            year = node.venue_year.year;
        }
        const firstAuthor = node.authors.length > 0 ? node.authors[0].family_name : '';
        const fname = `${firstAuthor}-${venue_short_name}${year}-${node.title}`.replace(/ /g, '_').replace(/[^\w_-]/g, '');
        createPage({
            path: `/p/${fname}`,
            component: path.resolve(`src/pages/publication.tsx`),
            context: {
                id: node.id,
                fname,
                venue_short_name
            }
        });
    });
})
    return getAuthors;
}