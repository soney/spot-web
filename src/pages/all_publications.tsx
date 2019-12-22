import * as React from 'react'
import { MemberListDisplay } from '../templates/members';
import { PublicationListDisplay } from '../templates/publications';
import { graphql } from 'gatsby';
import Link from 'gatsby-link'

import { StrapiAuthorGroupConnection, StrapiPublicationGroupConnection } from '../../graphql-types';

import './index.scss'

export const indexQuery = graphql`query allPubs {
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
            <Link to='/'>(home)</Link>
            <PublicationListDisplay limit={false} groupByVenue={true} data={ data.allStrapiPublication.nodes } />
        </div>;
    }
}