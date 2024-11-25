import { graphql } from 'gatsby';
import * as React from 'react';
import { AuthorListDisplay } from '../components/authors';
import { Layout, LayoutHead, SpotPage } from '../components/layout';
import { ExternalLink } from 'lucide-react';
import { getCreatedEditedString } from '../pages/writing';
import Markdown from 'react-markdown';
import './blogpost.scss';

export const pubQuery = graphql`query blogpost($id: String!) {
    strapiBlogpost(id: {eq: $id}) {
        id
        title
        created
        authors {
            id
            given_name
            family_name
            homepage
        }
        google_doc
        content {
            data {
                id
                content
            }
        }
    }
}`;


interface BlogPostProps {
    data: {
        strapiBlogpost: Queries.STRAPI_BLOGPOST
    }
}

export const Head = LayoutHead((props: BlogPostProps) => props.data.strapiBlogpost.title);

export default class extends React.Component<BlogPostProps, {}> {
    constructor(props: BlogPostProps) {
        super(props);
    }
    public render() {
        const blogpost = this.props.data.strapiBlogpost;
        if(blogpost.google_doc) {
            const embedURL = addEmbeddedTrueToUrl(blogpost.google_doc);
            return <Layout active={SpotPage.writing}>
                <div className="container writing">
                    <div className="post-info">
                        <strong>{blogpost.title}</strong> by <AuthorListDisplay authors={blogpost.authors} withLinks={true} />, {getCreatedEditedString(blogpost.created)}
                        <a className="float-end" href={blogpost.google_doc} target="_blank">Open in new window <ExternalLink size={18} /></a>
                    </div>
                    <iframe className="writing-post" src={embedURL}></iframe>
                </div>
            </Layout>;
        } else {
            return <Layout active={SpotPage.writing}>
                <div className="container writing">
                    <h2 className="">{blogpost.title}</h2>
                    by <AuthorListDisplay authors={blogpost.authors} withLinks={true} />, {getCreatedEditedString(blogpost.created)}
                    <Markdown>{blogpost.content.data.content}</Markdown>
                </div>
            </Layout>;
        }
    }
}
function addEmbeddedTrueToUrl(urlString: string): string {
    const url = new URL(urlString);
    url.searchParams.set("embedded", "true");
    return url.toString();
}