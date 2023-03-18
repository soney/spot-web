import * as React from 'react'
import { MemberListDisplay, MemberListLayout } from '../components/members';
import { graphql } from 'gatsby';
import { Layout, SpotPage } from '../components/layout';
import ReactMarkdown from 'react-markdown';

import { Strapi_AuthorGroupConnection, Strapi_Group } from '../../graphql-types';

export const indexQuery = graphql`query news {
    allStrapiNewsitem {
        nodes {
            id
            createdAt
            description {
                data {
                    description
                }
            }
            relevant_people {
                family_name
                given_name
            }
        }
    }
}`;

interface IndexPageProps {
    data: {
    }
}

export default class extends React.Component<IndexPageProps, {}> {
    constructor(props: IndexPageProps) {
        super(props);
    }
    public render() {
        const { data } = this.props;

        const newsItemDisplays = data.allStrapiNewsitem.nodes.map((node) => {
            return <div key={node.id} className = 'col col-sm-6'>
                <ReactMarkdown>{node.description.data.description}</ReactMarkdown>
            </div>
        });


        return <Layout active={SpotPage.news}>
            <div className="container">
                <h2 className="">News</h2>
                <div className="container">
                    <div className='row'>
                        {newsItemDisplays}
                    </div>
                </div>
            </div>
        </Layout>;
    }
}