import * as React from 'react'
import Members from '../templates/members';
import PublicationList from '../templates/publication_list';
import { StaticQuery, graphql } from 'gatsby';

import * as ReactMarkdown from 'react-markdown';

import Link from 'gatsby-link'
import Image from 'gatsby-image';

export const memberQuery = graphql`query member($id: String!) {
    strapiAuthor(id: {eq: $id}) {
        id
        given_name
        family_name
        middle_name
        homepage
        short_bio
        long_bio
        membership
        links {
            id
            url
            description
        }
        headshot {
            childImageSharp {
                fixed(width: 200, height: 125) {
                    ...GatsbyImageSharpFixed
                }
            }
        }
    }
}`;



export default class extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
    }
    public render() {
        const { data } = this.props;
        const pubs = this.props.pageContext.pubs;
        const links = data.strapiAuthor.links.map((l) => {
            return <li key={l.id}><a href={l.url} target='_blank'>{l.description}</a></li>
        });
        const pubsDisplay = pubs.map((p) => {
            return <li>{p.title}</li>
        })
        return (
            <div>
                <Link to='/'>(home)</Link>
                <h1>{data.strapiAuthor.given_name} {data.strapiAuthor.family_name}</h1>
                <Image fixed={data.strapiAuthor.headshot.childImageSharp.fixed} />
                <a href={data.strapiAuthor.homepage} target='_blank'>Homepage</a>
                <ul>{links}</ul>
                <ReactMarkdown source={data.strapiAuthor.long_bio} />
                <ul>{pubsDisplay}</ul>
            </div>
        );
    }
}