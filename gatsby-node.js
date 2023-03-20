/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');

// const makeRequest = (graphql, request) => new Promise((resolve, reject) => {
//     resolve(
//         graphql(request).then(result => {
//             if(result.errors) {
//                 reject(result.errors);
//             }
//             return result;
//         })
//     );
// });

// https://www.gatsbyjs.com/docs/debugging-the-build-process/

// const { createFilePath } = require("gatsby-source-filesystem")
// exports.onCreateNode = args => {
//   const { actions, node, getNode } = args

//   if (node.internal.type === "MarkdownRemark") {
//     const { createNodeField, createFilePath } = actions

//     const value = createFilePath({ node, getNode })
//     createNodeField({
//       name: `slug`,
//       node,
//       value,
//     })
//   }
// }

exports.createPages = async ({ actions, graphql }) => {
    const { createPage } = actions;
    const authors = await graphql(`{
            allStrapiAuthor(filter: {membership: {in: ["lead", "member"]}, use_local_homepage: {eq: true}}) {
                nodes {
                    id
                    given_name
                    family_name
                }
            }
            allStrapiPublication (
                sort: {venue: {year: DESC}}
            ) {
                nodes {
                    id
                    title
                    award
                    award_description
                    pub_details
                    status
                    short_description
                    authors {
                        id
                        given_name
                        family_name
                        membership
                        use_local_homepage
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
                    pdf {
                        localFile {
                            publicURL
                        }
                    }
                }
            }
            allStrapiVenue {
                nodes {
                    id,
                    short_name
                    type
                }
            }
            strapiLeadcv {
                name
                affiliation {
                    department
                    university
                    office
                    street
                    city
                }
                contact {
                    homepage
                    phone
                    email
                }
            }
        }`);
    authors.data.allStrapiAuthor.nodes.forEach(( node ) => {
        const authorPubs = authors.data.allStrapiPublication.nodes.filter((pn) => {
            const authors = pn.authors;
            return authors.some((a) => a.id === node.id) && 
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

    authors.data.allStrapiPublication.nodes.forEach(( node ) => {
        const downloadName = getDownloadName(node);
        createPage({
            path: `/${downloadName}`,
            component: path.resolve(`src/templates/publication.tsx`),
            context: {
                id: node.id
            }
        });
    });

    return authors;
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
        if(pub.venue.short_name) {
            short_venue_year = `${pub.venue.short_name}${pub.venue.year}`;
        } else {
            short_venue_year = `${pub.venue.year}`;
        }
    } else {
        short_venue_year = ``;
    }
    return `${shortAuthors}-${short_venue_year}-${pub.title}`.replace(/ /g, '_').replace(/[^\w_-]/g, '');
}