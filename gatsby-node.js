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
                        homepage
                        conference_start
                        conference_end
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
        const downloadName = getDownloadName(node, result.data.allStrapiVenue.nodes);
        createPage({
            path: `/p/${downloadName}`,
            component: path.resolve(`src/pages/publication.tsx`),
            context: {
                id: node.id
            }
        });
    });
})
    return getAuthors;
}

function getDownloadName(pub, venues) {
    let shortAuthors = '';
    if(pub.authors.length === 1) {
        shortAuthors = `${pub.authors[0].family_name}`;
    } else if(pub.authors.length === 2) {
        shortAuthors = `${pub.authors[0].family_name} and ${pub.authors[1].family_name}`;
    } else if(pub.authors.length > 2) {
        shortAuthors = `${pub.authors[0].family_name} et al`;
    }
    let short_venue_year = '';
    if(pub.venue_year) {
        if(pub.venue_year.venue) {
            const venue = findVenue(pub.venue_year.venue, venues);
            if(venue) {
                short_venue_year = `${venue.short_name}${pub.venue_year.year}`;
            } else {
                short_venue_year = `${pub.venue_year.year}`;
            }
        } else {
            short_venue_year = ``;
        }
    }
    return `${shortAuthors}-${short_venue_year}-${pub.title}`.replace(/ /g, '_').replace(/[^\w_-]/g, '');
}
function findVenue(id, data) {
    for(let i = 0; i<data.length; i++) {
        if(id === data[i].strapiId) {
            return data[i];
        }
    }
    return  null;
}