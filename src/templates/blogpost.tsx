import { graphql } from 'gatsby';
import * as React from 'react';
import { AuthorListDisplay } from '../components/authors';
import { Layout, LayoutHead, SpotPage } from '../components/layout';
import { AwardDisplay, getDownloadName } from '../components/publications';
import './blogpost.scss';
import { getCreatedEditedString } from '../pages/writing';
import Markdown from 'react-markdown';

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
                <div className="container">
                    <strong>{blogpost.title}</strong> by <AuthorListDisplay authors={blogpost.authors} withLinks={true} />, {getCreatedEditedString(blogpost.created)}
                    <iframe className="writing-post" src={embedURL}></iframe>
                </div>
            </Layout>;
        } else {
            console.log(blogpost);
            return <Layout active={SpotPage.writing}>
                <div className="container">
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