import * as React from 'react'
import { StrapiAuthor } from '../../graphql-types';
import Link from 'gatsby-link'

interface AuthorDisplayProps {
    data: StrapiAuthor,
    withLinks?: boolean,
    highlight?: boolean
}

export class AuthorDisplay extends React.Component<AuthorDisplayProps, {}> {
    constructor(props: AuthorDisplayProps, context: {}) {
        super(props, context);
    }
    public render(): JSX.Element {
        const { data } = this.props;
        const className = this.props.highlight ? 'highlight paper-author' : 'paper-author';
        if(this.props.withLinks) {
            if((data.membership === 'member') || (data.membership === 'lead')) {
                return <span className={className}><Link className="author-internal-link" to={`/${data.given_name}_${data.family_name}`}>{`${data.given_name} ${data.family_name}`}</Link></span>
            } else if(data.homepage) {
                return <span className={className}><a className="author-external-link" href={data.homepage} target="_blank">{`${data.given_name} ${data.family_name}`}</a></span>
            }
        }
        return <span className={className}>{`${data.given_name} ${data.family_name}`}</span>
    }
}

interface AuthorListDisplayProps {
    authors: ReadonlyArray<StrapiAuthor>,
    withLinks?: boolean
    highlightAuthors?: number[]
}
export class AuthorListDisplay extends React.Component<AuthorListDisplayProps, {}> {
    constructor(props: AuthorListDisplayProps, context: {}) {
        super(props, context);
    }

    public render(): JSX.Element {
        const { highlightAuthors, authors } = this.props;
        const authorDisplays:(string | JSX.Element)[] = authors.map((a) => <AuthorDisplay highlight={(highlightAuthors && (highlightAuthors.includes(a.id as any)))} withLinks={this.props.withLinks} key={a.id} data={a} />)
        if (authorDisplays.length === 2) {
            authorDisplays.splice(1, 0, ' and ');
        } else if (authorDisplays.length > 2) {
            authorDisplays.splice(authorDisplays.length-1, 0, ', and ');
            for(let i: number = authorDisplays.length-3; i>0; i--) {
                authorDisplays.splice(i, 0, ', ');
            }
        }

        return <span className='paper-author-list'>{authorDisplays}</span>;
    }
}