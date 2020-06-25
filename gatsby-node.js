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
    const getAuthors = makeRequest(graphql, `{
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
                    award
                    award_description
                    pub_details
                    short_description
                    status
                    authors {
                        id
                        given_name
                        family_name
                        membership
                        homepage
                    }
                    venue {
                        id
                        location
                        year
                        type
                        homepage
                        conference_start
                        conference_end
                        short_name
                    }
                }
            }
            allStrapiVenue {
                nodes {
                    id,
                    strapiId
                    short_name
                    type
                }
            }
        }`).then(result => {
            result.data.allStrapiAuthor.nodes.forEach(( node ) => {
                const authorPubs = result.data.allStrapiPublication.nodes.filter((pn) => {
                    const authors = pn.authors;
                    return authors.some((a) => a.id === node.strapiId) && 
                        (pn.venue.type === 'conference' || pn.venue.type === 'journal');
                });
                createPage({
                    path: `/${node.given_name}_${node.family_name}`,
                    component: path.resolve(`src/templates/member.tsx`),
                    context: {
                        id: node.id,
                        pubs: authorPubs
                    }
                });
            });
            result.data.allStrapiPublication.nodes.forEach(( node ) => {
                const downloadName = getDownloadName(node);
                createPage({
                    path: `/${downloadName}`,
                    component: path.resolve(`src/templates/publication.tsx`),
                    context: {
                        id: node.id
                    }
                });
            });
        });
    return Promise.all([getAuthors]);
}

function getDownloadName(pub) {
    let shortAuthors = '';
    if(pub.authors.length === 1) {
        shortAuthors = `${pub.authors[0].family_name}`;
    } else if(pub.authors.length === 2) {
        shortAuthors = `${pub.authors[0].family_name} and ${pub.authors[1].family_name}`;
    } else if(pub.authors.length > 2) {
        shortAuthors = `${pub.authors[0].family_name} et al`;
    }
    let short_venue_year = '';
    if(pub.venue) {
        short_venue_year = `${pub.venue.short_name}${pub.venue.year}`;
    } else {
        short_venue_year = ``;
    }
    return `${shortAuthors}-${short_venue_year}-${pub.title}`.replace(/ /g, '_').replace(/[^\w_-]/g, '');
}