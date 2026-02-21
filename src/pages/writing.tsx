
import * as React from 'react'
import { Layout, SpotPage, LayoutHead } from '../components/layout';
import { graphql } from 'gatsby';
import { AuthorListDisplay } from '../components/authors';

export const indexQuery = graphql`query writing {
    allStrapiBlogpost (sort: {created: ASC}) {
        nodes {
            id
            title
            created
            authors {
                id
                given_name
                family_name
                homepage
            }
        }
    }
}`;

interface WritingPageProps {
    data: {
        allStrapiBlogpost: Queries.STRAPI_BLOGPOSTGroupConnection
    }
}

export const Head = LayoutHead('Writing');

export default class extends React.Component<WritingPageProps, {}> {
    constructor(props: WritingPageProps) {
        super(props);
    }
    public render() {
        const { data } = this.props;
        const posts = data.allStrapiBlogpost.nodes.map((node) => {
            return <li key={node.id} className="blogpost">
                <a href={getWritingName(node)}>
                    <span className="title">{node.title}</span>
                    &nbsp;| <span className="post-authors"><AuthorListDisplay authors={node.authors} withLinks={false} /></span>
                    <span className="created">{getCreatedEditedString(node.created)}</span>
                </a>
            </li>;
        });

        return <Layout active={SpotPage.writing}>
            <div className="container">
                <h1 className="h2">Writing</h1>
                <ul>{posts}</ul>
            </div>
        </Layout>;
    }
}

function getReadableDateString(date: Date): string {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function getCreatedEditedString(created: string): string {
    const createdAtDate = new Date(created);

    return `${getReadableDateString(createdAtDate)}`;
}

function getWritingName(blogpost: Queries.STRAPI_BLOGPOST): string {
    return `${blogpost.title}`.replace(/ /g, '_').replace(/[^\w_-]/g, '');
}