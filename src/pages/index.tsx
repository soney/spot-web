import * as React from 'react'
import Members from '../templates/members';
import { PublicationListDisplay } from '../templates/publications';
import { graphql } from 'gatsby';

import { StrapiAuthorGroupConnection, StrapiPublicationGroupConnection } from '../../graphql-types';

import './index.scss'

export const indexQuery = graphql`query membersAndLeads {
    allStrapiAuthor(filter: {membership: {in: ["lead", "member"]}}, sort: {fields: [membership, family_name], order: ASC}) {
        nodes {
            id
            given_name
            family_name
            middle_name
            homepage
            short_bio
            membership
            headshot {
                childImageSharp {
                    fixed(width: 200, height: 125) {
                        ...GatsbyImageSharpFixed
                    }
                }
            }
        }
    }
    allStrapiPublication {
        nodes {
            id
            title
            award
            pub_details
            authors {
                id
                given_name
                family_name
                homepage
            }
            venue_year {
                id
                location
                venue
                year
                conference_start
                conference_end
            }
            pdf {
                publicURL
                childImageSharp {
                    fixed(width: 200, height: 125) {
                        ...GatsbyImageSharpFixed
                    }
                }
            }
        }
    }
}`;

interface IndexPageProps {
    data: {
        allStrapiAuthor: StrapiAuthorGroupConnection,
        allStrapiPublication: StrapiPublicationGroupConnection
    }
}

export default class extends React.Component<IndexPageProps, {}> {
    constructor(props: IndexPageProps, context: {}) {
        super(props, context);
    }
    public render() {
        const { data } = this.props;
        return <div className='container'>
            <h1>spot group</h1>
            <p>Welcome to the homepage of the spot group.</p>
            <Members data={data.allStrapiAuthor} />
            <PublicationListDisplay groupByVenue={true} data={ data.allStrapiPublication.nodes } />
        </div>;
    }
}