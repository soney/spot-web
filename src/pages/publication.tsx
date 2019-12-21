import * as React from 'react'
import Members from '../templates/members';
import { PublicationListDisplay } from '../templates/publications';
import { StaticQuery, graphql } from 'gatsby';

import * as ReactMarkdown from 'react-markdown';

import Link from 'gatsby-link'
import Image from 'gatsby-image';

export const pubQuery = graphql`query publication($id: String!) {
    strapiPublication(id: {eq: $id}) {
        id
        title
        abstract
        award
        pdf {
            id
            publicURL
        }
        authors {
            id
            given_name
            family_name
            homepage
        }
        venue_year {
            id
            year
            venue
        }
    }
}`;

export default class extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
    }
    public render() {
        const { data } = this.props;
        const authorsDisplay = data.strapiPublication.authors.map((author: any) => {
            // if(author.homepage) {
                // return <li key={author.id} className='paper-author'><a href={author.homepage} target='_blank'>{author.given_name} {author.family_name}</a></li>
            // } else {
                return <li key={author.id} className='paper-author'>{author.given_name} {author.family_name}</li>
            // }
        });
        const awardDisplay = (data.strapiPublication.award === 'best_paper') ? <i className='fas fa-trophy'></i> :
                (data.strapiPublication.award === 'honorable_mention' ? <i className="fas fa-award"></i>: null);
        
        // console.log(data.pdf);
        // const firstAuthor = data.authors.length > 0 ? data.authors[0].family_name : '';
        // const fname = `${firstAuthor}-${venue_short_name}${year}-${data.title}`.replace(/ /g, '_').replace(/[^\w_-]/g, '');
        const fname = this.props.pageContext.fname;
        const pdfDisplay = data.strapiPublication.pdf ? <a href={data.strapiPublication.pdf.publicURL} download={fname}>PDF</a> : null;
        return (
            <div>
                <Link to='/'>(home)</Link>
                <h1>{data.strapiPublication.title}</h1>
                {this.props.pageContext.venue_short_name} {data.strapiPublication.venue_year.year}
                {awardDisplay}
                <ul>
                    {authorsDisplay}
                </ul>
                {pdfDisplay}
                <p>{data.strapiPublication.abstract}</p>
            </div>
        );
    }
}