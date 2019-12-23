export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  /** 
 * A date string, such as 2007-12-03, compliant with the ISO 8601 standard for
   * representation of dates and times using the Gregorian calendar.
 */
  Date: any,
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any,
};











export type BooleanQueryOperatorInput = {
  eq?: Maybe<Scalars['Boolean']>,
  ne?: Maybe<Scalars['Boolean']>,
  in?: Maybe<Array<Maybe<Scalars['Boolean']>>>,
  nin?: Maybe<Array<Maybe<Scalars['Boolean']>>>,
};


export type DateQueryOperatorInput = {
  eq?: Maybe<Scalars['Date']>,
  ne?: Maybe<Scalars['Date']>,
  gt?: Maybe<Scalars['Date']>,
  gte?: Maybe<Scalars['Date']>,
  lt?: Maybe<Scalars['Date']>,
  lte?: Maybe<Scalars['Date']>,
  in?: Maybe<Array<Maybe<Scalars['Date']>>>,
  nin?: Maybe<Array<Maybe<Scalars['Date']>>>,
};

export type Directory = Node & {
  sourceInstanceName: Scalars['String'],
  absolutePath: Scalars['String'],
  relativePath: Scalars['String'],
  extension: Scalars['String'],
  size: Scalars['Int'],
  prettySize: Scalars['String'],
  modifiedTime: Scalars['Date'],
  accessTime: Scalars['Date'],
  changeTime: Scalars['Date'],
  birthTime: Scalars['Date'],
  root: Scalars['String'],
  dir: Scalars['String'],
  base: Scalars['String'],
  ext: Scalars['String'],
  name: Scalars['String'],
  relativeDirectory: Scalars['String'],
  dev: Scalars['Int'],
  mode: Scalars['Int'],
  nlink: Scalars['Int'],
  uid: Scalars['Int'],
  gid: Scalars['Int'],
  rdev: Scalars['Int'],
  ino: Scalars['Float'],
  atimeMs: Scalars['Float'],
  mtimeMs: Scalars['Float'],
  ctimeMs: Scalars['Float'],
  atime: Scalars['Date'],
  mtime: Scalars['Date'],
  ctime: Scalars['Date'],
  birthtime?: Maybe<Scalars['Date']>,
  birthtimeMs?: Maybe<Scalars['Float']>,
  blksize?: Maybe<Scalars['Int']>,
  blocks?: Maybe<Scalars['Int']>,
  id: Scalars['ID'],
  parent?: Maybe<Node>,
  children: Array<Node>,
  internal: Internal,
};


export type DirectoryModifiedTimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type DirectoryAccessTimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type DirectoryChangeTimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type DirectoryBirthTimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type DirectoryAtimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type DirectoryMtimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type DirectoryCtimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};

export type DirectoryConnection = {
  totalCount: Scalars['Int'],
  edges: Array<DirectoryEdge>,
  nodes: Array<Directory>,
  pageInfo: PageInfo,
  distinct: Array<Scalars['String']>,
  group: Array<DirectoryGroupConnection>,
};


export type DirectoryConnectionDistinctArgs = {
  field: DirectoryFieldsEnum
};


export type DirectoryConnectionGroupArgs = {
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>,
  field: DirectoryFieldsEnum
};

export type DirectoryEdge = {
  next?: Maybe<Directory>,
  node: Directory,
  previous?: Maybe<Directory>,
};

export type DirectoryFieldsEnum = 
  'sourceInstanceName' |
  'absolutePath' |
  'relativePath' |
  'extension' |
  'size' |
  'prettySize' |
  'modifiedTime' |
  'accessTime' |
  'changeTime' |
  'birthTime' |
  'root' |
  'dir' |
  'base' |
  'ext' |
  'name' |
  'relativeDirectory' |
  'dev' |
  'mode' |
  'nlink' |
  'uid' |
  'gid' |
  'rdev' |
  'ino' |
  'atimeMs' |
  'mtimeMs' |
  'ctimeMs' |
  'atime' |
  'mtime' |
  'ctime' |
  'birthtime' |
  'birthtimeMs' |
  'blksize' |
  'blocks' |
  'id' |
  'parent___id' |
  'parent___parent___id' |
  'parent___parent___parent___id' |
  'parent___parent___parent___children' |
  'parent___parent___children' |
  'parent___parent___children___id' |
  'parent___parent___children___children' |
  'parent___parent___internal___content' |
  'parent___parent___internal___contentDigest' |
  'parent___parent___internal___description' |
  'parent___parent___internal___fieldOwners' |
  'parent___parent___internal___ignoreType' |
  'parent___parent___internal___mediaType' |
  'parent___parent___internal___owner' |
  'parent___parent___internal___type' |
  'parent___children' |
  'parent___children___id' |
  'parent___children___parent___id' |
  'parent___children___parent___children' |
  'parent___children___children' |
  'parent___children___children___id' |
  'parent___children___children___children' |
  'parent___children___internal___content' |
  'parent___children___internal___contentDigest' |
  'parent___children___internal___description' |
  'parent___children___internal___fieldOwners' |
  'parent___children___internal___ignoreType' |
  'parent___children___internal___mediaType' |
  'parent___children___internal___owner' |
  'parent___children___internal___type' |
  'parent___internal___content' |
  'parent___internal___contentDigest' |
  'parent___internal___description' |
  'parent___internal___fieldOwners' |
  'parent___internal___ignoreType' |
  'parent___internal___mediaType' |
  'parent___internal___owner' |
  'parent___internal___type' |
  'children' |
  'children___id' |
  'children___parent___id' |
  'children___parent___parent___id' |
  'children___parent___parent___children' |
  'children___parent___children' |
  'children___parent___children___id' |
  'children___parent___children___children' |
  'children___parent___internal___content' |
  'children___parent___internal___contentDigest' |
  'children___parent___internal___description' |
  'children___parent___internal___fieldOwners' |
  'children___parent___internal___ignoreType' |
  'children___parent___internal___mediaType' |
  'children___parent___internal___owner' |
  'children___parent___internal___type' |
  'children___children' |
  'children___children___id' |
  'children___children___parent___id' |
  'children___children___parent___children' |
  'children___children___children' |
  'children___children___children___id' |
  'children___children___children___children' |
  'children___children___internal___content' |
  'children___children___internal___contentDigest' |
  'children___children___internal___description' |
  'children___children___internal___fieldOwners' |
  'children___children___internal___ignoreType' |
  'children___children___internal___mediaType' |
  'children___children___internal___owner' |
  'children___children___internal___type' |
  'children___internal___content' |
  'children___internal___contentDigest' |
  'children___internal___description' |
  'children___internal___fieldOwners' |
  'children___internal___ignoreType' |
  'children___internal___mediaType' |
  'children___internal___owner' |
  'children___internal___type' |
  'internal___content' |
  'internal___contentDigest' |
  'internal___description' |
  'internal___fieldOwners' |
  'internal___ignoreType' |
  'internal___mediaType' |
  'internal___owner' |
  'internal___type';

export type DirectoryFilterInput = {
  sourceInstanceName?: Maybe<StringQueryOperatorInput>,
  absolutePath?: Maybe<StringQueryOperatorInput>,
  relativePath?: Maybe<StringQueryOperatorInput>,
  extension?: Maybe<StringQueryOperatorInput>,
  size?: Maybe<IntQueryOperatorInput>,
  prettySize?: Maybe<StringQueryOperatorInput>,
  modifiedTime?: Maybe<DateQueryOperatorInput>,
  accessTime?: Maybe<DateQueryOperatorInput>,
  changeTime?: Maybe<DateQueryOperatorInput>,
  birthTime?: Maybe<DateQueryOperatorInput>,
  root?: Maybe<StringQueryOperatorInput>,
  dir?: Maybe<StringQueryOperatorInput>,
  base?: Maybe<StringQueryOperatorInput>,
  ext?: Maybe<StringQueryOperatorInput>,
  name?: Maybe<StringQueryOperatorInput>,
  relativeDirectory?: Maybe<StringQueryOperatorInput>,
  dev?: Maybe<IntQueryOperatorInput>,
  mode?: Maybe<IntQueryOperatorInput>,
  nlink?: Maybe<IntQueryOperatorInput>,
  uid?: Maybe<IntQueryOperatorInput>,
  gid?: Maybe<IntQueryOperatorInput>,
  rdev?: Maybe<IntQueryOperatorInput>,
  ino?: Maybe<FloatQueryOperatorInput>,
  atimeMs?: Maybe<FloatQueryOperatorInput>,
  mtimeMs?: Maybe<FloatQueryOperatorInput>,
  ctimeMs?: Maybe<FloatQueryOperatorInput>,
  atime?: Maybe<DateQueryOperatorInput>,
  mtime?: Maybe<DateQueryOperatorInput>,
  ctime?: Maybe<DateQueryOperatorInput>,
  birthtime?: Maybe<DateQueryOperatorInput>,
  birthtimeMs?: Maybe<FloatQueryOperatorInput>,
  blksize?: Maybe<IntQueryOperatorInput>,
  blocks?: Maybe<IntQueryOperatorInput>,
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>,
};

export type DirectoryGroupConnection = {
  totalCount: Scalars['Int'],
  edges: Array<DirectoryEdge>,
  nodes: Array<Directory>,
  pageInfo: PageInfo,
  field: Scalars['String'],
  fieldValue?: Maybe<Scalars['String']>,
};

export type DirectorySortInput = {
  fields?: Maybe<Array<Maybe<DirectoryFieldsEnum>>>,
  order?: Maybe<Array<Maybe<SortOrderEnum>>>,
};

export type DuotoneGradient = {
  highlight: Scalars['String'],
  shadow: Scalars['String'],
  opacity?: Maybe<Scalars['Int']>,
};

export type File = Node & {
  sourceInstanceName: Scalars['String'],
  absolutePath: Scalars['String'],
  relativePath: Scalars['String'],
  extension: Scalars['String'],
  size: Scalars['Int'],
  prettySize: Scalars['String'],
  modifiedTime: Scalars['Date'],
  accessTime: Scalars['Date'],
  changeTime: Scalars['Date'],
  birthTime: Scalars['Date'],
  root: Scalars['String'],
  dir: Scalars['String'],
  base: Scalars['String'],
  ext: Scalars['String'],
  name: Scalars['String'],
  relativeDirectory: Scalars['String'],
  dev: Scalars['Int'],
  mode: Scalars['Int'],
  nlink: Scalars['Int'],
  uid: Scalars['Int'],
  gid: Scalars['Int'],
  rdev: Scalars['Int'],
  ino: Scalars['Float'],
  atimeMs: Scalars['Float'],
  mtimeMs: Scalars['Float'],
  ctimeMs: Scalars['Float'],
  atime: Scalars['Date'],
  mtime: Scalars['Date'],
  ctime: Scalars['Date'],
  birthtime?: Maybe<Scalars['Date']>,
  birthtimeMs?: Maybe<Scalars['Float']>,
  blksize?: Maybe<Scalars['Int']>,
  blocks?: Maybe<Scalars['Int']>,
  /** Copy file to static directory and return public url to it */
  publicURL?: Maybe<Scalars['String']>,
  childImageSharp?: Maybe<ImageSharp>,
  id: Scalars['ID'],
  parent?: Maybe<Node>,
  children: Array<Node>,
  internal: Internal,
};


export type FileModifiedTimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type FileAccessTimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type FileChangeTimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type FileBirthTimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type FileAtimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type FileMtimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type FileCtimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};

export type FileConnection = {
  totalCount: Scalars['Int'],
  edges: Array<FileEdge>,
  nodes: Array<File>,
  pageInfo: PageInfo,
  distinct: Array<Scalars['String']>,
  group: Array<FileGroupConnection>,
};


export type FileConnectionDistinctArgs = {
  field: FileFieldsEnum
};


export type FileConnectionGroupArgs = {
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>,
  field: FileFieldsEnum
};

export type FileEdge = {
  next?: Maybe<File>,
  node: File,
  previous?: Maybe<File>,
};

export type FileFieldsEnum = 
  'sourceInstanceName' |
  'absolutePath' |
  'relativePath' |
  'extension' |
  'size' |
  'prettySize' |
  'modifiedTime' |
  'accessTime' |
  'changeTime' |
  'birthTime' |
  'root' |
  'dir' |
  'base' |
  'ext' |
  'name' |
  'relativeDirectory' |
  'dev' |
  'mode' |
  'nlink' |
  'uid' |
  'gid' |
  'rdev' |
  'ino' |
  'atimeMs' |
  'mtimeMs' |
  'ctimeMs' |
  'atime' |
  'mtime' |
  'ctime' |
  'birthtime' |
  'birthtimeMs' |
  'blksize' |
  'blocks' |
  'publicURL' |
  'childImageSharp___fixed___base64' |
  'childImageSharp___fixed___tracedSVG' |
  'childImageSharp___fixed___aspectRatio' |
  'childImageSharp___fixed___width' |
  'childImageSharp___fixed___height' |
  'childImageSharp___fixed___src' |
  'childImageSharp___fixed___srcSet' |
  'childImageSharp___fixed___srcWebp' |
  'childImageSharp___fixed___srcSetWebp' |
  'childImageSharp___fixed___originalName' |
  'childImageSharp___resolutions___base64' |
  'childImageSharp___resolutions___tracedSVG' |
  'childImageSharp___resolutions___aspectRatio' |
  'childImageSharp___resolutions___width' |
  'childImageSharp___resolutions___height' |
  'childImageSharp___resolutions___src' |
  'childImageSharp___resolutions___srcSet' |
  'childImageSharp___resolutions___srcWebp' |
  'childImageSharp___resolutions___srcSetWebp' |
  'childImageSharp___resolutions___originalName' |
  'childImageSharp___fluid___base64' |
  'childImageSharp___fluid___tracedSVG' |
  'childImageSharp___fluid___aspectRatio' |
  'childImageSharp___fluid___src' |
  'childImageSharp___fluid___srcSet' |
  'childImageSharp___fluid___srcWebp' |
  'childImageSharp___fluid___srcSetWebp' |
  'childImageSharp___fluid___sizes' |
  'childImageSharp___fluid___originalImg' |
  'childImageSharp___fluid___originalName' |
  'childImageSharp___fluid___presentationWidth' |
  'childImageSharp___fluid___presentationHeight' |
  'childImageSharp___sizes___base64' |
  'childImageSharp___sizes___tracedSVG' |
  'childImageSharp___sizes___aspectRatio' |
  'childImageSharp___sizes___src' |
  'childImageSharp___sizes___srcSet' |
  'childImageSharp___sizes___srcWebp' |
  'childImageSharp___sizes___srcSetWebp' |
  'childImageSharp___sizes___sizes' |
  'childImageSharp___sizes___originalImg' |
  'childImageSharp___sizes___originalName' |
  'childImageSharp___sizes___presentationWidth' |
  'childImageSharp___sizes___presentationHeight' |
  'childImageSharp___original___width' |
  'childImageSharp___original___height' |
  'childImageSharp___original___src' |
  'childImageSharp___resize___src' |
  'childImageSharp___resize___tracedSVG' |
  'childImageSharp___resize___width' |
  'childImageSharp___resize___height' |
  'childImageSharp___resize___aspectRatio' |
  'childImageSharp___resize___originalName' |
  'childImageSharp___id' |
  'childImageSharp___parent___id' |
  'childImageSharp___parent___parent___id' |
  'childImageSharp___parent___parent___children' |
  'childImageSharp___parent___children' |
  'childImageSharp___parent___children___id' |
  'childImageSharp___parent___children___children' |
  'childImageSharp___parent___internal___content' |
  'childImageSharp___parent___internal___contentDigest' |
  'childImageSharp___parent___internal___description' |
  'childImageSharp___parent___internal___fieldOwners' |
  'childImageSharp___parent___internal___ignoreType' |
  'childImageSharp___parent___internal___mediaType' |
  'childImageSharp___parent___internal___owner' |
  'childImageSharp___parent___internal___type' |
  'childImageSharp___children' |
  'childImageSharp___children___id' |
  'childImageSharp___children___parent___id' |
  'childImageSharp___children___parent___children' |
  'childImageSharp___children___children' |
  'childImageSharp___children___children___id' |
  'childImageSharp___children___children___children' |
  'childImageSharp___children___internal___content' |
  'childImageSharp___children___internal___contentDigest' |
  'childImageSharp___children___internal___description' |
  'childImageSharp___children___internal___fieldOwners' |
  'childImageSharp___children___internal___ignoreType' |
  'childImageSharp___children___internal___mediaType' |
  'childImageSharp___children___internal___owner' |
  'childImageSharp___children___internal___type' |
  'childImageSharp___internal___content' |
  'childImageSharp___internal___contentDigest' |
  'childImageSharp___internal___description' |
  'childImageSharp___internal___fieldOwners' |
  'childImageSharp___internal___ignoreType' |
  'childImageSharp___internal___mediaType' |
  'childImageSharp___internal___owner' |
  'childImageSharp___internal___type' |
  'id' |
  'parent___id' |
  'parent___parent___id' |
  'parent___parent___parent___id' |
  'parent___parent___parent___children' |
  'parent___parent___children' |
  'parent___parent___children___id' |
  'parent___parent___children___children' |
  'parent___parent___internal___content' |
  'parent___parent___internal___contentDigest' |
  'parent___parent___internal___description' |
  'parent___parent___internal___fieldOwners' |
  'parent___parent___internal___ignoreType' |
  'parent___parent___internal___mediaType' |
  'parent___parent___internal___owner' |
  'parent___parent___internal___type' |
  'parent___children' |
  'parent___children___id' |
  'parent___children___parent___id' |
  'parent___children___parent___children' |
  'parent___children___children' |
  'parent___children___children___id' |
  'parent___children___children___children' |
  'parent___children___internal___content' |
  'parent___children___internal___contentDigest' |
  'parent___children___internal___description' |
  'parent___children___internal___fieldOwners' |
  'parent___children___internal___ignoreType' |
  'parent___children___internal___mediaType' |
  'parent___children___internal___owner' |
  'parent___children___internal___type' |
  'parent___internal___content' |
  'parent___internal___contentDigest' |
  'parent___internal___description' |
  'parent___internal___fieldOwners' |
  'parent___internal___ignoreType' |
  'parent___internal___mediaType' |
  'parent___internal___owner' |
  'parent___internal___type' |
  'children' |
  'children___id' |
  'children___parent___id' |
  'children___parent___parent___id' |
  'children___parent___parent___children' |
  'children___parent___children' |
  'children___parent___children___id' |
  'children___parent___children___children' |
  'children___parent___internal___content' |
  'children___parent___internal___contentDigest' |
  'children___parent___internal___description' |
  'children___parent___internal___fieldOwners' |
  'children___parent___internal___ignoreType' |
  'children___parent___internal___mediaType' |
  'children___parent___internal___owner' |
  'children___parent___internal___type' |
  'children___children' |
  'children___children___id' |
  'children___children___parent___id' |
  'children___children___parent___children' |
  'children___children___children' |
  'children___children___children___id' |
  'children___children___children___children' |
  'children___children___internal___content' |
  'children___children___internal___contentDigest' |
  'children___children___internal___description' |
  'children___children___internal___fieldOwners' |
  'children___children___internal___ignoreType' |
  'children___children___internal___mediaType' |
  'children___children___internal___owner' |
  'children___children___internal___type' |
  'children___internal___content' |
  'children___internal___contentDigest' |
  'children___internal___description' |
  'children___internal___fieldOwners' |
  'children___internal___ignoreType' |
  'children___internal___mediaType' |
  'children___internal___owner' |
  'children___internal___type' |
  'internal___content' |
  'internal___contentDigest' |
  'internal___description' |
  'internal___fieldOwners' |
  'internal___ignoreType' |
  'internal___mediaType' |
  'internal___owner' |
  'internal___type';

export type FileFilterInput = {
  sourceInstanceName?: Maybe<StringQueryOperatorInput>,
  absolutePath?: Maybe<StringQueryOperatorInput>,
  relativePath?: Maybe<StringQueryOperatorInput>,
  extension?: Maybe<StringQueryOperatorInput>,
  size?: Maybe<IntQueryOperatorInput>,
  prettySize?: Maybe<StringQueryOperatorInput>,
  modifiedTime?: Maybe<DateQueryOperatorInput>,
  accessTime?: Maybe<DateQueryOperatorInput>,
  changeTime?: Maybe<DateQueryOperatorInput>,
  birthTime?: Maybe<DateQueryOperatorInput>,
  root?: Maybe<StringQueryOperatorInput>,
  dir?: Maybe<StringQueryOperatorInput>,
  base?: Maybe<StringQueryOperatorInput>,
  ext?: Maybe<StringQueryOperatorInput>,
  name?: Maybe<StringQueryOperatorInput>,
  relativeDirectory?: Maybe<StringQueryOperatorInput>,
  dev?: Maybe<IntQueryOperatorInput>,
  mode?: Maybe<IntQueryOperatorInput>,
  nlink?: Maybe<IntQueryOperatorInput>,
  uid?: Maybe<IntQueryOperatorInput>,
  gid?: Maybe<IntQueryOperatorInput>,
  rdev?: Maybe<IntQueryOperatorInput>,
  ino?: Maybe<FloatQueryOperatorInput>,
  atimeMs?: Maybe<FloatQueryOperatorInput>,
  mtimeMs?: Maybe<FloatQueryOperatorInput>,
  ctimeMs?: Maybe<FloatQueryOperatorInput>,
  atime?: Maybe<DateQueryOperatorInput>,
  mtime?: Maybe<DateQueryOperatorInput>,
  ctime?: Maybe<DateQueryOperatorInput>,
  birthtime?: Maybe<DateQueryOperatorInput>,
  birthtimeMs?: Maybe<FloatQueryOperatorInput>,
  blksize?: Maybe<IntQueryOperatorInput>,
  blocks?: Maybe<IntQueryOperatorInput>,
  publicURL?: Maybe<StringQueryOperatorInput>,
  childImageSharp?: Maybe<ImageSharpFilterInput>,
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>,
};

export type FileGroupConnection = {
  totalCount: Scalars['Int'],
  edges: Array<FileEdge>,
  nodes: Array<File>,
  pageInfo: PageInfo,
  field: Scalars['String'],
  fieldValue?: Maybe<Scalars['String']>,
};

export type FileSortInput = {
  fields?: Maybe<Array<Maybe<FileFieldsEnum>>>,
  order?: Maybe<Array<Maybe<SortOrderEnum>>>,
};

export type FloatQueryOperatorInput = {
  eq?: Maybe<Scalars['Float']>,
  ne?: Maybe<Scalars['Float']>,
  gt?: Maybe<Scalars['Float']>,
  gte?: Maybe<Scalars['Float']>,
  lt?: Maybe<Scalars['Float']>,
  lte?: Maybe<Scalars['Float']>,
  in?: Maybe<Array<Maybe<Scalars['Float']>>>,
  nin?: Maybe<Array<Maybe<Scalars['Float']>>>,
};

export type ImageCropFocus = 
  'CENTER' |
  'NORTH' |
  'NORTHEAST' |
  'EAST' |
  'SOUTHEAST' |
  'SOUTH' |
  'SOUTHWEST' |
  'WEST' |
  'NORTHWEST' |
  'ENTROPY' |
  'ATTENTION';

export type ImageFit = 
  'COVER' |
  'CONTAIN' |
  'FILL';

export type ImageFormat = 
  'NO_CHANGE' |
  'JPG' |
  'PNG' |
  'WEBP';

export type ImageSharp = Node & {
  fixed?: Maybe<ImageSharpFixed>,
  resolutions?: Maybe<ImageSharpResolutions>,
  fluid?: Maybe<ImageSharpFluid>,
  sizes?: Maybe<ImageSharpSizes>,
  original?: Maybe<ImageSharpOriginal>,
  resize?: Maybe<ImageSharpResize>,
  id: Scalars['ID'],
  parent?: Maybe<Node>,
  children: Array<Node>,
  internal: Internal,
};


export type ImageSharpFixedArgs = {
  width?: Maybe<Scalars['Int']>,
  height?: Maybe<Scalars['Int']>,
  base64Width?: Maybe<Scalars['Int']>,
  jpegProgressive?: Maybe<Scalars['Boolean']>,
  pngCompressionSpeed?: Maybe<Scalars['Int']>,
  grayscale?: Maybe<Scalars['Boolean']>,
  duotone?: Maybe<DuotoneGradient>,
  traceSVG?: Maybe<Potrace>,
  quality?: Maybe<Scalars['Int']>,
  jpegQuality?: Maybe<Scalars['Int']>,
  pngQuality?: Maybe<Scalars['Int']>,
  webpQuality?: Maybe<Scalars['Int']>,
  toFormat?: Maybe<ImageFormat>,
  toFormatBase64?: Maybe<ImageFormat>,
  cropFocus?: Maybe<ImageCropFocus>,
  fit?: Maybe<ImageFit>,
  background?: Maybe<Scalars['String']>,
  rotate?: Maybe<Scalars['Int']>,
  trim?: Maybe<Scalars['Float']>
};


export type ImageSharpResolutionsArgs = {
  width?: Maybe<Scalars['Int']>,
  height?: Maybe<Scalars['Int']>,
  base64Width?: Maybe<Scalars['Int']>,
  jpegProgressive?: Maybe<Scalars['Boolean']>,
  pngCompressionSpeed?: Maybe<Scalars['Int']>,
  grayscale?: Maybe<Scalars['Boolean']>,
  duotone?: Maybe<DuotoneGradient>,
  traceSVG?: Maybe<Potrace>,
  quality?: Maybe<Scalars['Int']>,
  jpegQuality?: Maybe<Scalars['Int']>,
  pngQuality?: Maybe<Scalars['Int']>,
  webpQuality?: Maybe<Scalars['Int']>,
  toFormat?: Maybe<ImageFormat>,
  toFormatBase64?: Maybe<ImageFormat>,
  cropFocus?: Maybe<ImageCropFocus>,
  fit?: Maybe<ImageFit>,
  background?: Maybe<Scalars['String']>,
  rotate?: Maybe<Scalars['Int']>,
  trim?: Maybe<Scalars['Float']>
};


export type ImageSharpFluidArgs = {
  maxWidth?: Maybe<Scalars['Int']>,
  maxHeight?: Maybe<Scalars['Int']>,
  base64Width?: Maybe<Scalars['Int']>,
  grayscale?: Maybe<Scalars['Boolean']>,
  jpegProgressive?: Maybe<Scalars['Boolean']>,
  pngCompressionSpeed?: Maybe<Scalars['Int']>,
  duotone?: Maybe<DuotoneGradient>,
  traceSVG?: Maybe<Potrace>,
  quality?: Maybe<Scalars['Int']>,
  jpegQuality?: Maybe<Scalars['Int']>,
  pngQuality?: Maybe<Scalars['Int']>,
  webpQuality?: Maybe<Scalars['Int']>,
  toFormat?: Maybe<ImageFormat>,
  toFormatBase64?: Maybe<ImageFormat>,
  cropFocus?: Maybe<ImageCropFocus>,
  fit?: Maybe<ImageFit>,
  background?: Maybe<Scalars['String']>,
  rotate?: Maybe<Scalars['Int']>,
  trim?: Maybe<Scalars['Float']>,
  sizes?: Maybe<Scalars['String']>,
  srcSetBreakpoints?: Maybe<Array<Maybe<Scalars['Int']>>>
};


export type ImageSharpSizesArgs = {
  maxWidth?: Maybe<Scalars['Int']>,
  maxHeight?: Maybe<Scalars['Int']>,
  base64Width?: Maybe<Scalars['Int']>,
  grayscale?: Maybe<Scalars['Boolean']>,
  jpegProgressive?: Maybe<Scalars['Boolean']>,
  pngCompressionSpeed?: Maybe<Scalars['Int']>,
  duotone?: Maybe<DuotoneGradient>,
  traceSVG?: Maybe<Potrace>,
  quality?: Maybe<Scalars['Int']>,
  jpegQuality?: Maybe<Scalars['Int']>,
  pngQuality?: Maybe<Scalars['Int']>,
  webpQuality?: Maybe<Scalars['Int']>,
  toFormat?: Maybe<ImageFormat>,
  toFormatBase64?: Maybe<ImageFormat>,
  cropFocus?: Maybe<ImageCropFocus>,
  fit?: Maybe<ImageFit>,
  background?: Maybe<Scalars['String']>,
  rotate?: Maybe<Scalars['Int']>,
  trim?: Maybe<Scalars['Float']>,
  sizes?: Maybe<Scalars['String']>,
  srcSetBreakpoints?: Maybe<Array<Maybe<Scalars['Int']>>>
};


export type ImageSharpResizeArgs = {
  width?: Maybe<Scalars['Int']>,
  height?: Maybe<Scalars['Int']>,
  quality?: Maybe<Scalars['Int']>,
  jpegQuality?: Maybe<Scalars['Int']>,
  pngQuality?: Maybe<Scalars['Int']>,
  webpQuality?: Maybe<Scalars['Int']>,
  jpegProgressive?: Maybe<Scalars['Boolean']>,
  pngCompressionLevel?: Maybe<Scalars['Int']>,
  pngCompressionSpeed?: Maybe<Scalars['Int']>,
  grayscale?: Maybe<Scalars['Boolean']>,
  duotone?: Maybe<DuotoneGradient>,
  base64?: Maybe<Scalars['Boolean']>,
  traceSVG?: Maybe<Potrace>,
  toFormat?: Maybe<ImageFormat>,
  cropFocus?: Maybe<ImageCropFocus>,
  fit?: Maybe<ImageFit>,
  background?: Maybe<Scalars['String']>,
  rotate?: Maybe<Scalars['Int']>,
  trim?: Maybe<Scalars['Float']>
};

export type ImageSharpConnection = {
  totalCount: Scalars['Int'],
  edges: Array<ImageSharpEdge>,
  nodes: Array<ImageSharp>,
  pageInfo: PageInfo,
  distinct: Array<Scalars['String']>,
  group: Array<ImageSharpGroupConnection>,
};


export type ImageSharpConnectionDistinctArgs = {
  field: ImageSharpFieldsEnum
};


export type ImageSharpConnectionGroupArgs = {
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>,
  field: ImageSharpFieldsEnum
};

export type ImageSharpEdge = {
  next?: Maybe<ImageSharp>,
  node: ImageSharp,
  previous?: Maybe<ImageSharp>,
};

export type ImageSharpFieldsEnum = 
  'fixed___base64' |
  'fixed___tracedSVG' |
  'fixed___aspectRatio' |
  'fixed___width' |
  'fixed___height' |
  'fixed___src' |
  'fixed___srcSet' |
  'fixed___srcWebp' |
  'fixed___srcSetWebp' |
  'fixed___originalName' |
  'resolutions___base64' |
  'resolutions___tracedSVG' |
  'resolutions___aspectRatio' |
  'resolutions___width' |
  'resolutions___height' |
  'resolutions___src' |
  'resolutions___srcSet' |
  'resolutions___srcWebp' |
  'resolutions___srcSetWebp' |
  'resolutions___originalName' |
  'fluid___base64' |
  'fluid___tracedSVG' |
  'fluid___aspectRatio' |
  'fluid___src' |
  'fluid___srcSet' |
  'fluid___srcWebp' |
  'fluid___srcSetWebp' |
  'fluid___sizes' |
  'fluid___originalImg' |
  'fluid___originalName' |
  'fluid___presentationWidth' |
  'fluid___presentationHeight' |
  'sizes___base64' |
  'sizes___tracedSVG' |
  'sizes___aspectRatio' |
  'sizes___src' |
  'sizes___srcSet' |
  'sizes___srcWebp' |
  'sizes___srcSetWebp' |
  'sizes___sizes' |
  'sizes___originalImg' |
  'sizes___originalName' |
  'sizes___presentationWidth' |
  'sizes___presentationHeight' |
  'original___width' |
  'original___height' |
  'original___src' |
  'resize___src' |
  'resize___tracedSVG' |
  'resize___width' |
  'resize___height' |
  'resize___aspectRatio' |
  'resize___originalName' |
  'id' |
  'parent___id' |
  'parent___parent___id' |
  'parent___parent___parent___id' |
  'parent___parent___parent___children' |
  'parent___parent___children' |
  'parent___parent___children___id' |
  'parent___parent___children___children' |
  'parent___parent___internal___content' |
  'parent___parent___internal___contentDigest' |
  'parent___parent___internal___description' |
  'parent___parent___internal___fieldOwners' |
  'parent___parent___internal___ignoreType' |
  'parent___parent___internal___mediaType' |
  'parent___parent___internal___owner' |
  'parent___parent___internal___type' |
  'parent___children' |
  'parent___children___id' |
  'parent___children___parent___id' |
  'parent___children___parent___children' |
  'parent___children___children' |
  'parent___children___children___id' |
  'parent___children___children___children' |
  'parent___children___internal___content' |
  'parent___children___internal___contentDigest' |
  'parent___children___internal___description' |
  'parent___children___internal___fieldOwners' |
  'parent___children___internal___ignoreType' |
  'parent___children___internal___mediaType' |
  'parent___children___internal___owner' |
  'parent___children___internal___type' |
  'parent___internal___content' |
  'parent___internal___contentDigest' |
  'parent___internal___description' |
  'parent___internal___fieldOwners' |
  'parent___internal___ignoreType' |
  'parent___internal___mediaType' |
  'parent___internal___owner' |
  'parent___internal___type' |
  'children' |
  'children___id' |
  'children___parent___id' |
  'children___parent___parent___id' |
  'children___parent___parent___children' |
  'children___parent___children' |
  'children___parent___children___id' |
  'children___parent___children___children' |
  'children___parent___internal___content' |
  'children___parent___internal___contentDigest' |
  'children___parent___internal___description' |
  'children___parent___internal___fieldOwners' |
  'children___parent___internal___ignoreType' |
  'children___parent___internal___mediaType' |
  'children___parent___internal___owner' |
  'children___parent___internal___type' |
  'children___children' |
  'children___children___id' |
  'children___children___parent___id' |
  'children___children___parent___children' |
  'children___children___children' |
  'children___children___children___id' |
  'children___children___children___children' |
  'children___children___internal___content' |
  'children___children___internal___contentDigest' |
  'children___children___internal___description' |
  'children___children___internal___fieldOwners' |
  'children___children___internal___ignoreType' |
  'children___children___internal___mediaType' |
  'children___children___internal___owner' |
  'children___children___internal___type' |
  'children___internal___content' |
  'children___internal___contentDigest' |
  'children___internal___description' |
  'children___internal___fieldOwners' |
  'children___internal___ignoreType' |
  'children___internal___mediaType' |
  'children___internal___owner' |
  'children___internal___type' |
  'internal___content' |
  'internal___contentDigest' |
  'internal___description' |
  'internal___fieldOwners' |
  'internal___ignoreType' |
  'internal___mediaType' |
  'internal___owner' |
  'internal___type';

export type ImageSharpFilterInput = {
  fixed?: Maybe<ImageSharpFixedFilterInput>,
  resolutions?: Maybe<ImageSharpResolutionsFilterInput>,
  fluid?: Maybe<ImageSharpFluidFilterInput>,
  sizes?: Maybe<ImageSharpSizesFilterInput>,
  original?: Maybe<ImageSharpOriginalFilterInput>,
  resize?: Maybe<ImageSharpResizeFilterInput>,
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>,
};

export type ImageSharpFixed = {
  base64?: Maybe<Scalars['String']>,
  tracedSVG?: Maybe<Scalars['String']>,
  aspectRatio?: Maybe<Scalars['Float']>,
  width?: Maybe<Scalars['Float']>,
  height?: Maybe<Scalars['Float']>,
  src?: Maybe<Scalars['String']>,
  srcSet?: Maybe<Scalars['String']>,
  srcWebp?: Maybe<Scalars['String']>,
  srcSetWebp?: Maybe<Scalars['String']>,
  originalName?: Maybe<Scalars['String']>,
};

export type ImageSharpFixedFilterInput = {
  base64?: Maybe<StringQueryOperatorInput>,
  tracedSVG?: Maybe<StringQueryOperatorInput>,
  aspectRatio?: Maybe<FloatQueryOperatorInput>,
  width?: Maybe<FloatQueryOperatorInput>,
  height?: Maybe<FloatQueryOperatorInput>,
  src?: Maybe<StringQueryOperatorInput>,
  srcSet?: Maybe<StringQueryOperatorInput>,
  srcWebp?: Maybe<StringQueryOperatorInput>,
  srcSetWebp?: Maybe<StringQueryOperatorInput>,
  originalName?: Maybe<StringQueryOperatorInput>,
};

export type ImageSharpFluid = {
  base64?: Maybe<Scalars['String']>,
  tracedSVG?: Maybe<Scalars['String']>,
  aspectRatio?: Maybe<Scalars['Float']>,
  src?: Maybe<Scalars['String']>,
  srcSet?: Maybe<Scalars['String']>,
  srcWebp?: Maybe<Scalars['String']>,
  srcSetWebp?: Maybe<Scalars['String']>,
  sizes?: Maybe<Scalars['String']>,
  originalImg?: Maybe<Scalars['String']>,
  originalName?: Maybe<Scalars['String']>,
  presentationWidth?: Maybe<Scalars['Int']>,
  presentationHeight?: Maybe<Scalars['Int']>,
};

export type ImageSharpFluidFilterInput = {
  base64?: Maybe<StringQueryOperatorInput>,
  tracedSVG?: Maybe<StringQueryOperatorInput>,
  aspectRatio?: Maybe<FloatQueryOperatorInput>,
  src?: Maybe<StringQueryOperatorInput>,
  srcSet?: Maybe<StringQueryOperatorInput>,
  srcWebp?: Maybe<StringQueryOperatorInput>,
  srcSetWebp?: Maybe<StringQueryOperatorInput>,
  sizes?: Maybe<StringQueryOperatorInput>,
  originalImg?: Maybe<StringQueryOperatorInput>,
  originalName?: Maybe<StringQueryOperatorInput>,
  presentationWidth?: Maybe<IntQueryOperatorInput>,
  presentationHeight?: Maybe<IntQueryOperatorInput>,
};

export type ImageSharpGroupConnection = {
  totalCount: Scalars['Int'],
  edges: Array<ImageSharpEdge>,
  nodes: Array<ImageSharp>,
  pageInfo: PageInfo,
  field: Scalars['String'],
  fieldValue?: Maybe<Scalars['String']>,
};

export type ImageSharpOriginal = {
  width?: Maybe<Scalars['Float']>,
  height?: Maybe<Scalars['Float']>,
  src?: Maybe<Scalars['String']>,
};

export type ImageSharpOriginalFilterInput = {
  width?: Maybe<FloatQueryOperatorInput>,
  height?: Maybe<FloatQueryOperatorInput>,
  src?: Maybe<StringQueryOperatorInput>,
};

export type ImageSharpResize = {
  src?: Maybe<Scalars['String']>,
  tracedSVG?: Maybe<Scalars['String']>,
  width?: Maybe<Scalars['Int']>,
  height?: Maybe<Scalars['Int']>,
  aspectRatio?: Maybe<Scalars['Float']>,
  originalName?: Maybe<Scalars['String']>,
};

export type ImageSharpResizeFilterInput = {
  src?: Maybe<StringQueryOperatorInput>,
  tracedSVG?: Maybe<StringQueryOperatorInput>,
  width?: Maybe<IntQueryOperatorInput>,
  height?: Maybe<IntQueryOperatorInput>,
  aspectRatio?: Maybe<FloatQueryOperatorInput>,
  originalName?: Maybe<StringQueryOperatorInput>,
};

export type ImageSharpResolutions = {
  base64?: Maybe<Scalars['String']>,
  tracedSVG?: Maybe<Scalars['String']>,
  aspectRatio?: Maybe<Scalars['Float']>,
  width?: Maybe<Scalars['Float']>,
  height?: Maybe<Scalars['Float']>,
  src?: Maybe<Scalars['String']>,
  srcSet?: Maybe<Scalars['String']>,
  srcWebp?: Maybe<Scalars['String']>,
  srcSetWebp?: Maybe<Scalars['String']>,
  originalName?: Maybe<Scalars['String']>,
};

export type ImageSharpResolutionsFilterInput = {
  base64?: Maybe<StringQueryOperatorInput>,
  tracedSVG?: Maybe<StringQueryOperatorInput>,
  aspectRatio?: Maybe<FloatQueryOperatorInput>,
  width?: Maybe<FloatQueryOperatorInput>,
  height?: Maybe<FloatQueryOperatorInput>,
  src?: Maybe<StringQueryOperatorInput>,
  srcSet?: Maybe<StringQueryOperatorInput>,
  srcWebp?: Maybe<StringQueryOperatorInput>,
  srcSetWebp?: Maybe<StringQueryOperatorInput>,
  originalName?: Maybe<StringQueryOperatorInput>,
};

export type ImageSharpSizes = {
  base64?: Maybe<Scalars['String']>,
  tracedSVG?: Maybe<Scalars['String']>,
  aspectRatio?: Maybe<Scalars['Float']>,
  src?: Maybe<Scalars['String']>,
  srcSet?: Maybe<Scalars['String']>,
  srcWebp?: Maybe<Scalars['String']>,
  srcSetWebp?: Maybe<Scalars['String']>,
  sizes?: Maybe<Scalars['String']>,
  originalImg?: Maybe<Scalars['String']>,
  originalName?: Maybe<Scalars['String']>,
  presentationWidth?: Maybe<Scalars['Int']>,
  presentationHeight?: Maybe<Scalars['Int']>,
};

export type ImageSharpSizesFilterInput = {
  base64?: Maybe<StringQueryOperatorInput>,
  tracedSVG?: Maybe<StringQueryOperatorInput>,
  aspectRatio?: Maybe<FloatQueryOperatorInput>,
  src?: Maybe<StringQueryOperatorInput>,
  srcSet?: Maybe<StringQueryOperatorInput>,
  srcWebp?: Maybe<StringQueryOperatorInput>,
  srcSetWebp?: Maybe<StringQueryOperatorInput>,
  sizes?: Maybe<StringQueryOperatorInput>,
  originalImg?: Maybe<StringQueryOperatorInput>,
  originalName?: Maybe<StringQueryOperatorInput>,
  presentationWidth?: Maybe<IntQueryOperatorInput>,
  presentationHeight?: Maybe<IntQueryOperatorInput>,
};

export type ImageSharpSortInput = {
  fields?: Maybe<Array<Maybe<ImageSharpFieldsEnum>>>,
  order?: Maybe<Array<Maybe<SortOrderEnum>>>,
};

export type Internal = {
  content?: Maybe<Scalars['String']>,
  contentDigest: Scalars['String'],
  description?: Maybe<Scalars['String']>,
  fieldOwners?: Maybe<Array<Maybe<Scalars['String']>>>,
  ignoreType?: Maybe<Scalars['Boolean']>,
  mediaType?: Maybe<Scalars['String']>,
  owner: Scalars['String'],
  type: Scalars['String'],
};

export type InternalFilterInput = {
  content?: Maybe<StringQueryOperatorInput>,
  contentDigest?: Maybe<StringQueryOperatorInput>,
  description?: Maybe<StringQueryOperatorInput>,
  fieldOwners?: Maybe<StringQueryOperatorInput>,
  ignoreType?: Maybe<BooleanQueryOperatorInput>,
  mediaType?: Maybe<StringQueryOperatorInput>,
  owner?: Maybe<StringQueryOperatorInput>,
  type?: Maybe<StringQueryOperatorInput>,
};

export type IntQueryOperatorInput = {
  eq?: Maybe<Scalars['Int']>,
  ne?: Maybe<Scalars['Int']>,
  gt?: Maybe<Scalars['Int']>,
  gte?: Maybe<Scalars['Int']>,
  lt?: Maybe<Scalars['Int']>,
  lte?: Maybe<Scalars['Int']>,
  in?: Maybe<Array<Maybe<Scalars['Int']>>>,
  nin?: Maybe<Array<Maybe<Scalars['Int']>>>,
};


/** Node Interface */
export type Node = {
  id: Scalars['ID'],
  parent?: Maybe<Node>,
  children: Array<Node>,
  internal: Internal,
};

export type NodeFilterInput = {
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>,
};

export type NodeFilterListInput = {
  elemMatch?: Maybe<NodeFilterInput>,
};

export type PageInfo = {
  currentPage: Scalars['Int'],
  hasPreviousPage: Scalars['Boolean'],
  hasNextPage: Scalars['Boolean'],
  itemCount: Scalars['Int'],
  pageCount: Scalars['Int'],
  perPage?: Maybe<Scalars['Int']>,
};

export type Potrace = {
  turnPolicy?: Maybe<PotraceTurnPolicy>,
  turdSize?: Maybe<Scalars['Float']>,
  alphaMax?: Maybe<Scalars['Float']>,
  optCurve?: Maybe<Scalars['Boolean']>,
  optTolerance?: Maybe<Scalars['Float']>,
  threshold?: Maybe<Scalars['Int']>,
  blackOnWhite?: Maybe<Scalars['Boolean']>,
  color?: Maybe<Scalars['String']>,
  background?: Maybe<Scalars['String']>,
};

export type PotraceTurnPolicy = 
  'TURNPOLICY_BLACK' |
  'TURNPOLICY_WHITE' |
  'TURNPOLICY_LEFT' |
  'TURNPOLICY_RIGHT' |
  'TURNPOLICY_MINORITY' |
  'TURNPOLICY_MAJORITY';

export type Query = {
  file?: Maybe<File>,
  allFile: FileConnection,
  directory?: Maybe<Directory>,
  allDirectory: DirectoryConnection,
  imageSharp?: Maybe<ImageSharp>,
  allImageSharp: ImageSharpConnection,
  strapiVenue?: Maybe<StrapiVenue>,
  allStrapiVenue: StrapiVenueConnection,
  strapiPublication?: Maybe<StrapiPublication>,
  allStrapiPublication: StrapiPublicationConnection,
  strapiAuthor?: Maybe<StrapiAuthor>,
  allStrapiAuthor: StrapiAuthorConnection,
  site?: Maybe<Site>,
  allSite: SiteConnection,
  sitePlugin?: Maybe<SitePlugin>,
  allSitePlugin: SitePluginConnection,
  sitePage?: Maybe<SitePage>,
  allSitePage: SitePageConnection,
};


export type QueryFileArgs = {
  sourceInstanceName?: Maybe<StringQueryOperatorInput>,
  absolutePath?: Maybe<StringQueryOperatorInput>,
  relativePath?: Maybe<StringQueryOperatorInput>,
  extension?: Maybe<StringQueryOperatorInput>,
  size?: Maybe<IntQueryOperatorInput>,
  prettySize?: Maybe<StringQueryOperatorInput>,
  modifiedTime?: Maybe<DateQueryOperatorInput>,
  accessTime?: Maybe<DateQueryOperatorInput>,
  changeTime?: Maybe<DateQueryOperatorInput>,
  birthTime?: Maybe<DateQueryOperatorInput>,
  root?: Maybe<StringQueryOperatorInput>,
  dir?: Maybe<StringQueryOperatorInput>,
  base?: Maybe<StringQueryOperatorInput>,
  ext?: Maybe<StringQueryOperatorInput>,
  name?: Maybe<StringQueryOperatorInput>,
  relativeDirectory?: Maybe<StringQueryOperatorInput>,
  dev?: Maybe<IntQueryOperatorInput>,
  mode?: Maybe<IntQueryOperatorInput>,
  nlink?: Maybe<IntQueryOperatorInput>,
  uid?: Maybe<IntQueryOperatorInput>,
  gid?: Maybe<IntQueryOperatorInput>,
  rdev?: Maybe<IntQueryOperatorInput>,
  ino?: Maybe<FloatQueryOperatorInput>,
  atimeMs?: Maybe<FloatQueryOperatorInput>,
  mtimeMs?: Maybe<FloatQueryOperatorInput>,
  ctimeMs?: Maybe<FloatQueryOperatorInput>,
  atime?: Maybe<DateQueryOperatorInput>,
  mtime?: Maybe<DateQueryOperatorInput>,
  ctime?: Maybe<DateQueryOperatorInput>,
  birthtime?: Maybe<DateQueryOperatorInput>,
  birthtimeMs?: Maybe<FloatQueryOperatorInput>,
  blksize?: Maybe<IntQueryOperatorInput>,
  blocks?: Maybe<IntQueryOperatorInput>,
  publicURL?: Maybe<StringQueryOperatorInput>,
  childImageSharp?: Maybe<ImageSharpFilterInput>,
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>
};


export type QueryAllFileArgs = {
  filter?: Maybe<FileFilterInput>,
  sort?: Maybe<FileSortInput>,
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>
};


export type QueryDirectoryArgs = {
  sourceInstanceName?: Maybe<StringQueryOperatorInput>,
  absolutePath?: Maybe<StringQueryOperatorInput>,
  relativePath?: Maybe<StringQueryOperatorInput>,
  extension?: Maybe<StringQueryOperatorInput>,
  size?: Maybe<IntQueryOperatorInput>,
  prettySize?: Maybe<StringQueryOperatorInput>,
  modifiedTime?: Maybe<DateQueryOperatorInput>,
  accessTime?: Maybe<DateQueryOperatorInput>,
  changeTime?: Maybe<DateQueryOperatorInput>,
  birthTime?: Maybe<DateQueryOperatorInput>,
  root?: Maybe<StringQueryOperatorInput>,
  dir?: Maybe<StringQueryOperatorInput>,
  base?: Maybe<StringQueryOperatorInput>,
  ext?: Maybe<StringQueryOperatorInput>,
  name?: Maybe<StringQueryOperatorInput>,
  relativeDirectory?: Maybe<StringQueryOperatorInput>,
  dev?: Maybe<IntQueryOperatorInput>,
  mode?: Maybe<IntQueryOperatorInput>,
  nlink?: Maybe<IntQueryOperatorInput>,
  uid?: Maybe<IntQueryOperatorInput>,
  gid?: Maybe<IntQueryOperatorInput>,
  rdev?: Maybe<IntQueryOperatorInput>,
  ino?: Maybe<FloatQueryOperatorInput>,
  atimeMs?: Maybe<FloatQueryOperatorInput>,
  mtimeMs?: Maybe<FloatQueryOperatorInput>,
  ctimeMs?: Maybe<FloatQueryOperatorInput>,
  atime?: Maybe<DateQueryOperatorInput>,
  mtime?: Maybe<DateQueryOperatorInput>,
  ctime?: Maybe<DateQueryOperatorInput>,
  birthtime?: Maybe<DateQueryOperatorInput>,
  birthtimeMs?: Maybe<FloatQueryOperatorInput>,
  blksize?: Maybe<IntQueryOperatorInput>,
  blocks?: Maybe<IntQueryOperatorInput>,
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>
};


export type QueryAllDirectoryArgs = {
  filter?: Maybe<DirectoryFilterInput>,
  sort?: Maybe<DirectorySortInput>,
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>
};


export type QueryImageSharpArgs = {
  fixed?: Maybe<ImageSharpFixedFilterInput>,
  resolutions?: Maybe<ImageSharpResolutionsFilterInput>,
  fluid?: Maybe<ImageSharpFluidFilterInput>,
  sizes?: Maybe<ImageSharpSizesFilterInput>,
  original?: Maybe<ImageSharpOriginalFilterInput>,
  resize?: Maybe<ImageSharpResizeFilterInput>,
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>
};


export type QueryAllImageSharpArgs = {
  filter?: Maybe<ImageSharpFilterInput>,
  sort?: Maybe<ImageSharpSortInput>,
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>
};


export type QueryStrapiVenueArgs = {
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>,
  short_name?: Maybe<StringQueryOperatorInput>,
  long_name?: Maybe<StringQueryOperatorInput>,
  type?: Maybe<StringQueryOperatorInput>,
  created_at?: Maybe<DateQueryOperatorInput>,
  updated_at?: Maybe<DateQueryOperatorInput>,
  venue_years?: Maybe<StrapiVenueVenue_YearsFilterListInput>,
  strapiId?: Maybe<IntQueryOperatorInput>
};


export type QueryAllStrapiVenueArgs = {
  filter?: Maybe<StrapiVenueFilterInput>,
  sort?: Maybe<StrapiVenueSortInput>,
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>
};


export type QueryStrapiPublicationArgs = {
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>,
  title?: Maybe<StringQueryOperatorInput>,
  abstract?: Maybe<StringQueryOperatorInput>,
  venue_year?: Maybe<StrapiPublicationVenue_YearFilterInput>,
  short_description?: Maybe<StringQueryOperatorInput>,
  pub_details?: Maybe<StringQueryOperatorInput>,
  award?: Maybe<StringQueryOperatorInput>,
  status?: Maybe<StringQueryOperatorInput>,
  award_description?: Maybe<StringQueryOperatorInput>,
  created_at?: Maybe<DateQueryOperatorInput>,
  updated_at?: Maybe<DateQueryOperatorInput>,
  small_thumbnail?: Maybe<FileFilterInput>,
  small_thumbnail_active?: Maybe<FileFilterInput>,
  image?: Maybe<FileFilterInput>,
  pdf?: Maybe<FileFilterInput>,
  authors?: Maybe<StrapiPublicationAuthorsFilterListInput>,
  strapiId?: Maybe<IntQueryOperatorInput>
};


export type QueryAllStrapiPublicationArgs = {
  filter?: Maybe<StrapiPublicationFilterInput>,
  sort?: Maybe<StrapiPublicationSortInput>,
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>
};


export type QueryStrapiAuthorArgs = {
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>,
  given_name?: Maybe<StringQueryOperatorInput>,
  family_name?: Maybe<StringQueryOperatorInput>,
  middle_name?: Maybe<StringQueryOperatorInput>,
  membership?: Maybe<StringQueryOperatorInput>,
  homepage?: Maybe<StringQueryOperatorInput>,
  short_bio?: Maybe<StringQueryOperatorInput>,
  long_bio?: Maybe<StringQueryOperatorInput>,
  created_at?: Maybe<DateQueryOperatorInput>,
  updated_at?: Maybe<DateQueryOperatorInput>,
  links?: Maybe<StrapiAuthorLinksFilterListInput>,
  headshot?: Maybe<FileFilterInput>,
  strapiId?: Maybe<IntQueryOperatorInput>
};


export type QueryAllStrapiAuthorArgs = {
  filter?: Maybe<StrapiAuthorFilterInput>,
  sort?: Maybe<StrapiAuthorSortInput>,
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>
};


export type QuerySiteArgs = {
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>,
  siteMetadata?: Maybe<SiteSiteMetadataFilterInput>,
  port?: Maybe<IntQueryOperatorInput>,
  host?: Maybe<StringQueryOperatorInput>,
  polyfill?: Maybe<BooleanQueryOperatorInput>,
  pathPrefix?: Maybe<StringQueryOperatorInput>,
  buildTime?: Maybe<DateQueryOperatorInput>
};


export type QueryAllSiteArgs = {
  filter?: Maybe<SiteFilterInput>,
  sort?: Maybe<SiteSortInput>,
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>
};


export type QuerySitePluginArgs = {
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>,
  resolve?: Maybe<StringQueryOperatorInput>,
  name?: Maybe<StringQueryOperatorInput>,
  version?: Maybe<StringQueryOperatorInput>,
  pluginOptions?: Maybe<SitePluginPluginOptionsFilterInput>,
  nodeAPIs?: Maybe<StringQueryOperatorInput>,
  ssrAPIs?: Maybe<StringQueryOperatorInput>,
  pluginFilepath?: Maybe<StringQueryOperatorInput>,
  packageJson?: Maybe<SitePluginPackageJsonFilterInput>
};


export type QueryAllSitePluginArgs = {
  filter?: Maybe<SitePluginFilterInput>,
  sort?: Maybe<SitePluginSortInput>,
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>
};


export type QuerySitePageArgs = {
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>,
  path?: Maybe<StringQueryOperatorInput>,
  internalComponentName?: Maybe<StringQueryOperatorInput>,
  component?: Maybe<StringQueryOperatorInput>,
  componentChunkName?: Maybe<StringQueryOperatorInput>,
  isCreatedByStatefulCreatePages?: Maybe<BooleanQueryOperatorInput>,
  context?: Maybe<SitePageContextFilterInput>,
  pluginCreator?: Maybe<SitePluginFilterInput>,
  pluginCreatorId?: Maybe<StringQueryOperatorInput>,
  componentPath?: Maybe<StringQueryOperatorInput>
};


export type QueryAllSitePageArgs = {
  filter?: Maybe<SitePageFilterInput>,
  sort?: Maybe<SitePageSortInput>,
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>
};

export type Site = Node & {
  id: Scalars['ID'],
  parent?: Maybe<Node>,
  children: Array<Node>,
  internal: Internal,
  siteMetadata?: Maybe<SiteSiteMetadata>,
  port?: Maybe<Scalars['Int']>,
  host?: Maybe<Scalars['String']>,
  polyfill?: Maybe<Scalars['Boolean']>,
  pathPrefix?: Maybe<Scalars['String']>,
  buildTime?: Maybe<Scalars['Date']>,
};


export type SiteBuildTimeArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};

export type SiteConnection = {
  totalCount: Scalars['Int'],
  edges: Array<SiteEdge>,
  nodes: Array<Site>,
  pageInfo: PageInfo,
  distinct: Array<Scalars['String']>,
  group: Array<SiteGroupConnection>,
};


export type SiteConnectionDistinctArgs = {
  field: SiteFieldsEnum
};


export type SiteConnectionGroupArgs = {
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>,
  field: SiteFieldsEnum
};

export type SiteEdge = {
  next?: Maybe<Site>,
  node: Site,
  previous?: Maybe<Site>,
};

export type SiteFieldsEnum = 
  'id' |
  'parent___id' |
  'parent___parent___id' |
  'parent___parent___parent___id' |
  'parent___parent___parent___children' |
  'parent___parent___children' |
  'parent___parent___children___id' |
  'parent___parent___children___children' |
  'parent___parent___internal___content' |
  'parent___parent___internal___contentDigest' |
  'parent___parent___internal___description' |
  'parent___parent___internal___fieldOwners' |
  'parent___parent___internal___ignoreType' |
  'parent___parent___internal___mediaType' |
  'parent___parent___internal___owner' |
  'parent___parent___internal___type' |
  'parent___children' |
  'parent___children___id' |
  'parent___children___parent___id' |
  'parent___children___parent___children' |
  'parent___children___children' |
  'parent___children___children___id' |
  'parent___children___children___children' |
  'parent___children___internal___content' |
  'parent___children___internal___contentDigest' |
  'parent___children___internal___description' |
  'parent___children___internal___fieldOwners' |
  'parent___children___internal___ignoreType' |
  'parent___children___internal___mediaType' |
  'parent___children___internal___owner' |
  'parent___children___internal___type' |
  'parent___internal___content' |
  'parent___internal___contentDigest' |
  'parent___internal___description' |
  'parent___internal___fieldOwners' |
  'parent___internal___ignoreType' |
  'parent___internal___mediaType' |
  'parent___internal___owner' |
  'parent___internal___type' |
  'children' |
  'children___id' |
  'children___parent___id' |
  'children___parent___parent___id' |
  'children___parent___parent___children' |
  'children___parent___children' |
  'children___parent___children___id' |
  'children___parent___children___children' |
  'children___parent___internal___content' |
  'children___parent___internal___contentDigest' |
  'children___parent___internal___description' |
  'children___parent___internal___fieldOwners' |
  'children___parent___internal___ignoreType' |
  'children___parent___internal___mediaType' |
  'children___parent___internal___owner' |
  'children___parent___internal___type' |
  'children___children' |
  'children___children___id' |
  'children___children___parent___id' |
  'children___children___parent___children' |
  'children___children___children' |
  'children___children___children___id' |
  'children___children___children___children' |
  'children___children___internal___content' |
  'children___children___internal___contentDigest' |
  'children___children___internal___description' |
  'children___children___internal___fieldOwners' |
  'children___children___internal___ignoreType' |
  'children___children___internal___mediaType' |
  'children___children___internal___owner' |
  'children___children___internal___type' |
  'children___internal___content' |
  'children___internal___contentDigest' |
  'children___internal___description' |
  'children___internal___fieldOwners' |
  'children___internal___ignoreType' |
  'children___internal___mediaType' |
  'children___internal___owner' |
  'children___internal___type' |
  'internal___content' |
  'internal___contentDigest' |
  'internal___description' |
  'internal___fieldOwners' |
  'internal___ignoreType' |
  'internal___mediaType' |
  'internal___owner' |
  'internal___type' |
  'siteMetadata___title' |
  'siteMetadata___author' |
  'port' |
  'host' |
  'polyfill' |
  'pathPrefix' |
  'buildTime';

export type SiteFilterInput = {
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>,
  siteMetadata?: Maybe<SiteSiteMetadataFilterInput>,
  port?: Maybe<IntQueryOperatorInput>,
  host?: Maybe<StringQueryOperatorInput>,
  polyfill?: Maybe<BooleanQueryOperatorInput>,
  pathPrefix?: Maybe<StringQueryOperatorInput>,
  buildTime?: Maybe<DateQueryOperatorInput>,
};

export type SiteGroupConnection = {
  totalCount: Scalars['Int'],
  edges: Array<SiteEdge>,
  nodes: Array<Site>,
  pageInfo: PageInfo,
  field: Scalars['String'],
  fieldValue?: Maybe<Scalars['String']>,
};

export type SitePage = Node & {
  id: Scalars['ID'],
  parent?: Maybe<Node>,
  children: Array<Node>,
  internal: Internal,
  path?: Maybe<Scalars['String']>,
  internalComponentName?: Maybe<Scalars['String']>,
  component?: Maybe<Scalars['String']>,
  componentChunkName?: Maybe<Scalars['String']>,
  isCreatedByStatefulCreatePages?: Maybe<Scalars['Boolean']>,
  context?: Maybe<SitePageContext>,
  pluginCreator?: Maybe<SitePlugin>,
  pluginCreatorId?: Maybe<Scalars['String']>,
  componentPath?: Maybe<Scalars['String']>,
};

export type SitePageConnection = {
  totalCount: Scalars['Int'],
  edges: Array<SitePageEdge>,
  nodes: Array<SitePage>,
  pageInfo: PageInfo,
  distinct: Array<Scalars['String']>,
  group: Array<SitePageGroupConnection>,
};


export type SitePageConnectionDistinctArgs = {
  field: SitePageFieldsEnum
};


export type SitePageConnectionGroupArgs = {
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>,
  field: SitePageFieldsEnum
};

export type SitePageContext = {
  id?: Maybe<Scalars['String']>,
  pubs?: Maybe<Array<Maybe<SitePageContextPubs>>>,
};

export type SitePageContextFilterInput = {
  id?: Maybe<StringQueryOperatorInput>,
  pubs?: Maybe<SitePageContextPubsFilterListInput>,
};

export type SitePageContextPubs = {
  id?: Maybe<Scalars['String']>,
  title?: Maybe<Scalars['String']>,
  award?: Maybe<Scalars['String']>,
  award_description?: Maybe<Scalars['String']>,
  pub_details?: Maybe<Scalars['String']>,
  short_description?: Maybe<Scalars['String']>,
  authors?: Maybe<Array<Maybe<SitePageContextPubsAuthors>>>,
  venue_year?: Maybe<SitePageContextPubsVenue_Year>,
};

export type SitePageContextPubsAuthors = {
  id?: Maybe<Scalars['Int']>,
  given_name?: Maybe<Scalars['String']>,
  family_name?: Maybe<Scalars['String']>,
  membership?: Maybe<Scalars['String']>,
  homepage?: Maybe<Scalars['String']>,
};

export type SitePageContextPubsAuthorsFilterInput = {
  id?: Maybe<IntQueryOperatorInput>,
  given_name?: Maybe<StringQueryOperatorInput>,
  family_name?: Maybe<StringQueryOperatorInput>,
  membership?: Maybe<StringQueryOperatorInput>,
  homepage?: Maybe<StringQueryOperatorInput>,
};

export type SitePageContextPubsAuthorsFilterListInput = {
  elemMatch?: Maybe<SitePageContextPubsAuthorsFilterInput>,
};

export type SitePageContextPubsFilterInput = {
  id?: Maybe<StringQueryOperatorInput>,
  title?: Maybe<StringQueryOperatorInput>,
  award?: Maybe<StringQueryOperatorInput>,
  award_description?: Maybe<StringQueryOperatorInput>,
  pub_details?: Maybe<StringQueryOperatorInput>,
  short_description?: Maybe<StringQueryOperatorInput>,
  authors?: Maybe<SitePageContextPubsAuthorsFilterListInput>,
  venue_year?: Maybe<SitePageContextPubsVenue_YearFilterInput>,
};

export type SitePageContextPubsFilterListInput = {
  elemMatch?: Maybe<SitePageContextPubsFilterInput>,
};

export type SitePageContextPubsVenue_Year = {
  id?: Maybe<Scalars['Int']>,
  location?: Maybe<Scalars['String']>,
  venue?: Maybe<Scalars['Int']>,
  year?: Maybe<Scalars['Int']>,
  homepage?: Maybe<Scalars['String']>,
  conference_start?: Maybe<Scalars['Date']>,
  conference_end?: Maybe<Scalars['Date']>,
};

export type SitePageContextPubsVenue_YearFilterInput = {
  id?: Maybe<IntQueryOperatorInput>,
  location?: Maybe<StringQueryOperatorInput>,
  venue?: Maybe<IntQueryOperatorInput>,
  year?: Maybe<IntQueryOperatorInput>,
  homepage?: Maybe<StringQueryOperatorInput>,
  conference_start?: Maybe<DateQueryOperatorInput>,
  conference_end?: Maybe<DateQueryOperatorInput>,
};

export type SitePageEdge = {
  next?: Maybe<SitePage>,
  node: SitePage,
  previous?: Maybe<SitePage>,
};

export type SitePageFieldsEnum = 
  'id' |
  'parent___id' |
  'parent___parent___id' |
  'parent___parent___parent___id' |
  'parent___parent___parent___children' |
  'parent___parent___children' |
  'parent___parent___children___id' |
  'parent___parent___children___children' |
  'parent___parent___internal___content' |
  'parent___parent___internal___contentDigest' |
  'parent___parent___internal___description' |
  'parent___parent___internal___fieldOwners' |
  'parent___parent___internal___ignoreType' |
  'parent___parent___internal___mediaType' |
  'parent___parent___internal___owner' |
  'parent___parent___internal___type' |
  'parent___children' |
  'parent___children___id' |
  'parent___children___parent___id' |
  'parent___children___parent___children' |
  'parent___children___children' |
  'parent___children___children___id' |
  'parent___children___children___children' |
  'parent___children___internal___content' |
  'parent___children___internal___contentDigest' |
  'parent___children___internal___description' |
  'parent___children___internal___fieldOwners' |
  'parent___children___internal___ignoreType' |
  'parent___children___internal___mediaType' |
  'parent___children___internal___owner' |
  'parent___children___internal___type' |
  'parent___internal___content' |
  'parent___internal___contentDigest' |
  'parent___internal___description' |
  'parent___internal___fieldOwners' |
  'parent___internal___ignoreType' |
  'parent___internal___mediaType' |
  'parent___internal___owner' |
  'parent___internal___type' |
  'children' |
  'children___id' |
  'children___parent___id' |
  'children___parent___parent___id' |
  'children___parent___parent___children' |
  'children___parent___children' |
  'children___parent___children___id' |
  'children___parent___children___children' |
  'children___parent___internal___content' |
  'children___parent___internal___contentDigest' |
  'children___parent___internal___description' |
  'children___parent___internal___fieldOwners' |
  'children___parent___internal___ignoreType' |
  'children___parent___internal___mediaType' |
  'children___parent___internal___owner' |
  'children___parent___internal___type' |
  'children___children' |
  'children___children___id' |
  'children___children___parent___id' |
  'children___children___parent___children' |
  'children___children___children' |
  'children___children___children___id' |
  'children___children___children___children' |
  'children___children___internal___content' |
  'children___children___internal___contentDigest' |
  'children___children___internal___description' |
  'children___children___internal___fieldOwners' |
  'children___children___internal___ignoreType' |
  'children___children___internal___mediaType' |
  'children___children___internal___owner' |
  'children___children___internal___type' |
  'children___internal___content' |
  'children___internal___contentDigest' |
  'children___internal___description' |
  'children___internal___fieldOwners' |
  'children___internal___ignoreType' |
  'children___internal___mediaType' |
  'children___internal___owner' |
  'children___internal___type' |
  'internal___content' |
  'internal___contentDigest' |
  'internal___description' |
  'internal___fieldOwners' |
  'internal___ignoreType' |
  'internal___mediaType' |
  'internal___owner' |
  'internal___type' |
  'path' |
  'internalComponentName' |
  'component' |
  'componentChunkName' |
  'isCreatedByStatefulCreatePages' |
  'context___id' |
  'context___pubs' |
  'context___pubs___id' |
  'context___pubs___title' |
  'context___pubs___award' |
  'context___pubs___award_description' |
  'context___pubs___pub_details' |
  'context___pubs___short_description' |
  'context___pubs___authors' |
  'context___pubs___authors___id' |
  'context___pubs___authors___given_name' |
  'context___pubs___authors___family_name' |
  'context___pubs___authors___membership' |
  'context___pubs___authors___homepage' |
  'context___pubs___venue_year___id' |
  'context___pubs___venue_year___location' |
  'context___pubs___venue_year___venue' |
  'context___pubs___venue_year___year' |
  'context___pubs___venue_year___homepage' |
  'context___pubs___venue_year___conference_start' |
  'context___pubs___venue_year___conference_end' |
  'pluginCreator___id' |
  'pluginCreator___parent___id' |
  'pluginCreator___parent___parent___id' |
  'pluginCreator___parent___parent___children' |
  'pluginCreator___parent___children' |
  'pluginCreator___parent___children___id' |
  'pluginCreator___parent___children___children' |
  'pluginCreator___parent___internal___content' |
  'pluginCreator___parent___internal___contentDigest' |
  'pluginCreator___parent___internal___description' |
  'pluginCreator___parent___internal___fieldOwners' |
  'pluginCreator___parent___internal___ignoreType' |
  'pluginCreator___parent___internal___mediaType' |
  'pluginCreator___parent___internal___owner' |
  'pluginCreator___parent___internal___type' |
  'pluginCreator___children' |
  'pluginCreator___children___id' |
  'pluginCreator___children___parent___id' |
  'pluginCreator___children___parent___children' |
  'pluginCreator___children___children' |
  'pluginCreator___children___children___id' |
  'pluginCreator___children___children___children' |
  'pluginCreator___children___internal___content' |
  'pluginCreator___children___internal___contentDigest' |
  'pluginCreator___children___internal___description' |
  'pluginCreator___children___internal___fieldOwners' |
  'pluginCreator___children___internal___ignoreType' |
  'pluginCreator___children___internal___mediaType' |
  'pluginCreator___children___internal___owner' |
  'pluginCreator___children___internal___type' |
  'pluginCreator___internal___content' |
  'pluginCreator___internal___contentDigest' |
  'pluginCreator___internal___description' |
  'pluginCreator___internal___fieldOwners' |
  'pluginCreator___internal___ignoreType' |
  'pluginCreator___internal___mediaType' |
  'pluginCreator___internal___owner' |
  'pluginCreator___internal___type' |
  'pluginCreator___resolve' |
  'pluginCreator___name' |
  'pluginCreator___version' |
  'pluginCreator___pluginOptions___apiURL' |
  'pluginCreator___pluginOptions___contentTypes' |
  'pluginCreator___pluginOptions___queryLimit' |
  'pluginCreator___pluginOptions___fonts' |
  'pluginCreator___pluginOptions___name' |
  'pluginCreator___pluginOptions___path' |
  'pluginCreator___pluginOptions___pathCheck' |
  'pluginCreator___nodeAPIs' |
  'pluginCreator___ssrAPIs' |
  'pluginCreator___pluginFilepath' |
  'pluginCreator___packageJson___name' |
  'pluginCreator___packageJson___description' |
  'pluginCreator___packageJson___version' |
  'pluginCreator___packageJson___main' |
  'pluginCreator___packageJson___license' |
  'pluginCreator___packageJson___dependencies' |
  'pluginCreator___packageJson___dependencies___name' |
  'pluginCreator___packageJson___dependencies___version' |
  'pluginCreator___packageJson___devDependencies' |
  'pluginCreator___packageJson___devDependencies___name' |
  'pluginCreator___packageJson___devDependencies___version' |
  'pluginCreator___packageJson___peerDependencies' |
  'pluginCreator___packageJson___peerDependencies___name' |
  'pluginCreator___packageJson___peerDependencies___version' |
  'pluginCreator___packageJson___keywords' |
  'pluginCreatorId' |
  'componentPath';

export type SitePageFilterInput = {
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>,
  path?: Maybe<StringQueryOperatorInput>,
  internalComponentName?: Maybe<StringQueryOperatorInput>,
  component?: Maybe<StringQueryOperatorInput>,
  componentChunkName?: Maybe<StringQueryOperatorInput>,
  isCreatedByStatefulCreatePages?: Maybe<BooleanQueryOperatorInput>,
  context?: Maybe<SitePageContextFilterInput>,
  pluginCreator?: Maybe<SitePluginFilterInput>,
  pluginCreatorId?: Maybe<StringQueryOperatorInput>,
  componentPath?: Maybe<StringQueryOperatorInput>,
};

export type SitePageGroupConnection = {
  totalCount: Scalars['Int'],
  edges: Array<SitePageEdge>,
  nodes: Array<SitePage>,
  pageInfo: PageInfo,
  field: Scalars['String'],
  fieldValue?: Maybe<Scalars['String']>,
};

export type SitePageSortInput = {
  fields?: Maybe<Array<Maybe<SitePageFieldsEnum>>>,
  order?: Maybe<Array<Maybe<SortOrderEnum>>>,
};

export type SitePlugin = Node & {
  id: Scalars['ID'],
  parent?: Maybe<Node>,
  children: Array<Node>,
  internal: Internal,
  resolve?: Maybe<Scalars['String']>,
  name?: Maybe<Scalars['String']>,
  version?: Maybe<Scalars['String']>,
  pluginOptions?: Maybe<SitePluginPluginOptions>,
  nodeAPIs?: Maybe<Array<Maybe<Scalars['String']>>>,
  ssrAPIs?: Maybe<Array<Maybe<Scalars['String']>>>,
  pluginFilepath?: Maybe<Scalars['String']>,
  packageJson?: Maybe<SitePluginPackageJson>,
};

export type SitePluginConnection = {
  totalCount: Scalars['Int'],
  edges: Array<SitePluginEdge>,
  nodes: Array<SitePlugin>,
  pageInfo: PageInfo,
  distinct: Array<Scalars['String']>,
  group: Array<SitePluginGroupConnection>,
};


export type SitePluginConnectionDistinctArgs = {
  field: SitePluginFieldsEnum
};


export type SitePluginConnectionGroupArgs = {
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>,
  field: SitePluginFieldsEnum
};

export type SitePluginEdge = {
  next?: Maybe<SitePlugin>,
  node: SitePlugin,
  previous?: Maybe<SitePlugin>,
};

export type SitePluginFieldsEnum = 
  'id' |
  'parent___id' |
  'parent___parent___id' |
  'parent___parent___parent___id' |
  'parent___parent___parent___children' |
  'parent___parent___children' |
  'parent___parent___children___id' |
  'parent___parent___children___children' |
  'parent___parent___internal___content' |
  'parent___parent___internal___contentDigest' |
  'parent___parent___internal___description' |
  'parent___parent___internal___fieldOwners' |
  'parent___parent___internal___ignoreType' |
  'parent___parent___internal___mediaType' |
  'parent___parent___internal___owner' |
  'parent___parent___internal___type' |
  'parent___children' |
  'parent___children___id' |
  'parent___children___parent___id' |
  'parent___children___parent___children' |
  'parent___children___children' |
  'parent___children___children___id' |
  'parent___children___children___children' |
  'parent___children___internal___content' |
  'parent___children___internal___contentDigest' |
  'parent___children___internal___description' |
  'parent___children___internal___fieldOwners' |
  'parent___children___internal___ignoreType' |
  'parent___children___internal___mediaType' |
  'parent___children___internal___owner' |
  'parent___children___internal___type' |
  'parent___internal___content' |
  'parent___internal___contentDigest' |
  'parent___internal___description' |
  'parent___internal___fieldOwners' |
  'parent___internal___ignoreType' |
  'parent___internal___mediaType' |
  'parent___internal___owner' |
  'parent___internal___type' |
  'children' |
  'children___id' |
  'children___parent___id' |
  'children___parent___parent___id' |
  'children___parent___parent___children' |
  'children___parent___children' |
  'children___parent___children___id' |
  'children___parent___children___children' |
  'children___parent___internal___content' |
  'children___parent___internal___contentDigest' |
  'children___parent___internal___description' |
  'children___parent___internal___fieldOwners' |
  'children___parent___internal___ignoreType' |
  'children___parent___internal___mediaType' |
  'children___parent___internal___owner' |
  'children___parent___internal___type' |
  'children___children' |
  'children___children___id' |
  'children___children___parent___id' |
  'children___children___parent___children' |
  'children___children___children' |
  'children___children___children___id' |
  'children___children___children___children' |
  'children___children___internal___content' |
  'children___children___internal___contentDigest' |
  'children___children___internal___description' |
  'children___children___internal___fieldOwners' |
  'children___children___internal___ignoreType' |
  'children___children___internal___mediaType' |
  'children___children___internal___owner' |
  'children___children___internal___type' |
  'children___internal___content' |
  'children___internal___contentDigest' |
  'children___internal___description' |
  'children___internal___fieldOwners' |
  'children___internal___ignoreType' |
  'children___internal___mediaType' |
  'children___internal___owner' |
  'children___internal___type' |
  'internal___content' |
  'internal___contentDigest' |
  'internal___description' |
  'internal___fieldOwners' |
  'internal___ignoreType' |
  'internal___mediaType' |
  'internal___owner' |
  'internal___type' |
  'resolve' |
  'name' |
  'version' |
  'pluginOptions___apiURL' |
  'pluginOptions___contentTypes' |
  'pluginOptions___queryLimit' |
  'pluginOptions___fonts' |
  'pluginOptions___name' |
  'pluginOptions___path' |
  'pluginOptions___pathCheck' |
  'nodeAPIs' |
  'ssrAPIs' |
  'pluginFilepath' |
  'packageJson___name' |
  'packageJson___description' |
  'packageJson___version' |
  'packageJson___main' |
  'packageJson___license' |
  'packageJson___dependencies' |
  'packageJson___dependencies___name' |
  'packageJson___dependencies___version' |
  'packageJson___devDependencies' |
  'packageJson___devDependencies___name' |
  'packageJson___devDependencies___version' |
  'packageJson___peerDependencies' |
  'packageJson___peerDependencies___name' |
  'packageJson___peerDependencies___version' |
  'packageJson___keywords';

export type SitePluginFilterInput = {
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>,
  resolve?: Maybe<StringQueryOperatorInput>,
  name?: Maybe<StringQueryOperatorInput>,
  version?: Maybe<StringQueryOperatorInput>,
  pluginOptions?: Maybe<SitePluginPluginOptionsFilterInput>,
  nodeAPIs?: Maybe<StringQueryOperatorInput>,
  ssrAPIs?: Maybe<StringQueryOperatorInput>,
  pluginFilepath?: Maybe<StringQueryOperatorInput>,
  packageJson?: Maybe<SitePluginPackageJsonFilterInput>,
};

export type SitePluginGroupConnection = {
  totalCount: Scalars['Int'],
  edges: Array<SitePluginEdge>,
  nodes: Array<SitePlugin>,
  pageInfo: PageInfo,
  field: Scalars['String'],
  fieldValue?: Maybe<Scalars['String']>,
};

export type SitePluginPackageJson = {
  name?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  version?: Maybe<Scalars['String']>,
  main?: Maybe<Scalars['String']>,
  license?: Maybe<Scalars['String']>,
  dependencies?: Maybe<Array<Maybe<SitePluginPackageJsonDependencies>>>,
  devDependencies?: Maybe<Array<Maybe<SitePluginPackageJsonDevDependencies>>>,
  peerDependencies?: Maybe<Array<Maybe<SitePluginPackageJsonPeerDependencies>>>,
  keywords?: Maybe<Array<Maybe<Scalars['String']>>>,
};

export type SitePluginPackageJsonDependencies = {
  name?: Maybe<Scalars['String']>,
  version?: Maybe<Scalars['String']>,
};

export type SitePluginPackageJsonDependenciesFilterInput = {
  name?: Maybe<StringQueryOperatorInput>,
  version?: Maybe<StringQueryOperatorInput>,
};

export type SitePluginPackageJsonDependenciesFilterListInput = {
  elemMatch?: Maybe<SitePluginPackageJsonDependenciesFilterInput>,
};

export type SitePluginPackageJsonDevDependencies = {
  name?: Maybe<Scalars['String']>,
  version?: Maybe<Scalars['String']>,
};

export type SitePluginPackageJsonDevDependenciesFilterInput = {
  name?: Maybe<StringQueryOperatorInput>,
  version?: Maybe<StringQueryOperatorInput>,
};

export type SitePluginPackageJsonDevDependenciesFilterListInput = {
  elemMatch?: Maybe<SitePluginPackageJsonDevDependenciesFilterInput>,
};

export type SitePluginPackageJsonFilterInput = {
  name?: Maybe<StringQueryOperatorInput>,
  description?: Maybe<StringQueryOperatorInput>,
  version?: Maybe<StringQueryOperatorInput>,
  main?: Maybe<StringQueryOperatorInput>,
  license?: Maybe<StringQueryOperatorInput>,
  dependencies?: Maybe<SitePluginPackageJsonDependenciesFilterListInput>,
  devDependencies?: Maybe<SitePluginPackageJsonDevDependenciesFilterListInput>,
  peerDependencies?: Maybe<SitePluginPackageJsonPeerDependenciesFilterListInput>,
  keywords?: Maybe<StringQueryOperatorInput>,
};

export type SitePluginPackageJsonPeerDependencies = {
  name?: Maybe<Scalars['String']>,
  version?: Maybe<Scalars['String']>,
};

export type SitePluginPackageJsonPeerDependenciesFilterInput = {
  name?: Maybe<StringQueryOperatorInput>,
  version?: Maybe<StringQueryOperatorInput>,
};

export type SitePluginPackageJsonPeerDependenciesFilterListInput = {
  elemMatch?: Maybe<SitePluginPackageJsonPeerDependenciesFilterInput>,
};

export type SitePluginPluginOptions = {
  apiURL?: Maybe<Scalars['String']>,
  contentTypes?: Maybe<Array<Maybe<Scalars['String']>>>,
  queryLimit?: Maybe<Scalars['Int']>,
  fonts?: Maybe<Array<Maybe<Scalars['String']>>>,
  name?: Maybe<Scalars['String']>,
  path?: Maybe<Scalars['String']>,
  pathCheck?: Maybe<Scalars['Boolean']>,
};

export type SitePluginPluginOptionsFilterInput = {
  apiURL?: Maybe<StringQueryOperatorInput>,
  contentTypes?: Maybe<StringQueryOperatorInput>,
  queryLimit?: Maybe<IntQueryOperatorInput>,
  fonts?: Maybe<StringQueryOperatorInput>,
  name?: Maybe<StringQueryOperatorInput>,
  path?: Maybe<StringQueryOperatorInput>,
  pathCheck?: Maybe<BooleanQueryOperatorInput>,
};

export type SitePluginSortInput = {
  fields?: Maybe<Array<Maybe<SitePluginFieldsEnum>>>,
  order?: Maybe<Array<Maybe<SortOrderEnum>>>,
};

export type SiteSiteMetadata = {
  title?: Maybe<Scalars['String']>,
  author?: Maybe<Scalars['String']>,
};

export type SiteSiteMetadataFilterInput = {
  title?: Maybe<StringQueryOperatorInput>,
  author?: Maybe<StringQueryOperatorInput>,
};

export type SiteSortInput = {
  fields?: Maybe<Array<Maybe<SiteFieldsEnum>>>,
  order?: Maybe<Array<Maybe<SortOrderEnum>>>,
};

export type SortOrderEnum = 
  'ASC' |
  'DESC';

export type StrapiAuthor = Node & {
  id: Scalars['ID'],
  parent?: Maybe<Node>,
  children: Array<Node>,
  internal: Internal,
  given_name?: Maybe<Scalars['String']>,
  family_name?: Maybe<Scalars['String']>,
  middle_name?: Maybe<Scalars['String']>,
  membership?: Maybe<Scalars['String']>,
  homepage?: Maybe<Scalars['String']>,
  short_bio?: Maybe<Scalars['String']>,
  long_bio?: Maybe<Scalars['String']>,
  created_at?: Maybe<Scalars['Date']>,
  updated_at?: Maybe<Scalars['Date']>,
  links?: Maybe<Array<Maybe<StrapiAuthorLinks>>>,
  headshot?: Maybe<File>,
  strapiId?: Maybe<Scalars['Int']>,
};


export type StrapiAuthorCreated_AtArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type StrapiAuthorUpdated_AtArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};

export type StrapiAuthorConnection = {
  totalCount: Scalars['Int'],
  edges: Array<StrapiAuthorEdge>,
  nodes: Array<StrapiAuthor>,
  pageInfo: PageInfo,
  distinct: Array<Scalars['String']>,
  group: Array<StrapiAuthorGroupConnection>,
};


export type StrapiAuthorConnectionDistinctArgs = {
  field: StrapiAuthorFieldsEnum
};


export type StrapiAuthorConnectionGroupArgs = {
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>,
  field: StrapiAuthorFieldsEnum
};

export type StrapiAuthorEdge = {
  next?: Maybe<StrapiAuthor>,
  node: StrapiAuthor,
  previous?: Maybe<StrapiAuthor>,
};

export type StrapiAuthorFieldsEnum = 
  'id' |
  'parent___id' |
  'parent___parent___id' |
  'parent___parent___parent___id' |
  'parent___parent___parent___children' |
  'parent___parent___children' |
  'parent___parent___children___id' |
  'parent___parent___children___children' |
  'parent___parent___internal___content' |
  'parent___parent___internal___contentDigest' |
  'parent___parent___internal___description' |
  'parent___parent___internal___fieldOwners' |
  'parent___parent___internal___ignoreType' |
  'parent___parent___internal___mediaType' |
  'parent___parent___internal___owner' |
  'parent___parent___internal___type' |
  'parent___children' |
  'parent___children___id' |
  'parent___children___parent___id' |
  'parent___children___parent___children' |
  'parent___children___children' |
  'parent___children___children___id' |
  'parent___children___children___children' |
  'parent___children___internal___content' |
  'parent___children___internal___contentDigest' |
  'parent___children___internal___description' |
  'parent___children___internal___fieldOwners' |
  'parent___children___internal___ignoreType' |
  'parent___children___internal___mediaType' |
  'parent___children___internal___owner' |
  'parent___children___internal___type' |
  'parent___internal___content' |
  'parent___internal___contentDigest' |
  'parent___internal___description' |
  'parent___internal___fieldOwners' |
  'parent___internal___ignoreType' |
  'parent___internal___mediaType' |
  'parent___internal___owner' |
  'parent___internal___type' |
  'children' |
  'children___id' |
  'children___parent___id' |
  'children___parent___parent___id' |
  'children___parent___parent___children' |
  'children___parent___children' |
  'children___parent___children___id' |
  'children___parent___children___children' |
  'children___parent___internal___content' |
  'children___parent___internal___contentDigest' |
  'children___parent___internal___description' |
  'children___parent___internal___fieldOwners' |
  'children___parent___internal___ignoreType' |
  'children___parent___internal___mediaType' |
  'children___parent___internal___owner' |
  'children___parent___internal___type' |
  'children___children' |
  'children___children___id' |
  'children___children___parent___id' |
  'children___children___parent___children' |
  'children___children___children' |
  'children___children___children___id' |
  'children___children___children___children' |
  'children___children___internal___content' |
  'children___children___internal___contentDigest' |
  'children___children___internal___description' |
  'children___children___internal___fieldOwners' |
  'children___children___internal___ignoreType' |
  'children___children___internal___mediaType' |
  'children___children___internal___owner' |
  'children___children___internal___type' |
  'children___internal___content' |
  'children___internal___contentDigest' |
  'children___internal___description' |
  'children___internal___fieldOwners' |
  'children___internal___ignoreType' |
  'children___internal___mediaType' |
  'children___internal___owner' |
  'children___internal___type' |
  'internal___content' |
  'internal___contentDigest' |
  'internal___description' |
  'internal___fieldOwners' |
  'internal___ignoreType' |
  'internal___mediaType' |
  'internal___owner' |
  'internal___type' |
  'given_name' |
  'family_name' |
  'middle_name' |
  'membership' |
  'homepage' |
  'short_bio' |
  'long_bio' |
  'created_at' |
  'updated_at' |
  'links' |
  'links___id' |
  'links___description' |
  'links___url' |
  'headshot___sourceInstanceName' |
  'headshot___absolutePath' |
  'headshot___relativePath' |
  'headshot___extension' |
  'headshot___size' |
  'headshot___prettySize' |
  'headshot___modifiedTime' |
  'headshot___accessTime' |
  'headshot___changeTime' |
  'headshot___birthTime' |
  'headshot___root' |
  'headshot___dir' |
  'headshot___base' |
  'headshot___ext' |
  'headshot___name' |
  'headshot___relativeDirectory' |
  'headshot___dev' |
  'headshot___mode' |
  'headshot___nlink' |
  'headshot___uid' |
  'headshot___gid' |
  'headshot___rdev' |
  'headshot___ino' |
  'headshot___atimeMs' |
  'headshot___mtimeMs' |
  'headshot___ctimeMs' |
  'headshot___atime' |
  'headshot___mtime' |
  'headshot___ctime' |
  'headshot___birthtime' |
  'headshot___birthtimeMs' |
  'headshot___blksize' |
  'headshot___blocks' |
  'headshot___publicURL' |
  'headshot___childImageSharp___fixed___base64' |
  'headshot___childImageSharp___fixed___tracedSVG' |
  'headshot___childImageSharp___fixed___aspectRatio' |
  'headshot___childImageSharp___fixed___width' |
  'headshot___childImageSharp___fixed___height' |
  'headshot___childImageSharp___fixed___src' |
  'headshot___childImageSharp___fixed___srcSet' |
  'headshot___childImageSharp___fixed___srcWebp' |
  'headshot___childImageSharp___fixed___srcSetWebp' |
  'headshot___childImageSharp___fixed___originalName' |
  'headshot___childImageSharp___resolutions___base64' |
  'headshot___childImageSharp___resolutions___tracedSVG' |
  'headshot___childImageSharp___resolutions___aspectRatio' |
  'headshot___childImageSharp___resolutions___width' |
  'headshot___childImageSharp___resolutions___height' |
  'headshot___childImageSharp___resolutions___src' |
  'headshot___childImageSharp___resolutions___srcSet' |
  'headshot___childImageSharp___resolutions___srcWebp' |
  'headshot___childImageSharp___resolutions___srcSetWebp' |
  'headshot___childImageSharp___resolutions___originalName' |
  'headshot___childImageSharp___fluid___base64' |
  'headshot___childImageSharp___fluid___tracedSVG' |
  'headshot___childImageSharp___fluid___aspectRatio' |
  'headshot___childImageSharp___fluid___src' |
  'headshot___childImageSharp___fluid___srcSet' |
  'headshot___childImageSharp___fluid___srcWebp' |
  'headshot___childImageSharp___fluid___srcSetWebp' |
  'headshot___childImageSharp___fluid___sizes' |
  'headshot___childImageSharp___fluid___originalImg' |
  'headshot___childImageSharp___fluid___originalName' |
  'headshot___childImageSharp___fluid___presentationWidth' |
  'headshot___childImageSharp___fluid___presentationHeight' |
  'headshot___childImageSharp___sizes___base64' |
  'headshot___childImageSharp___sizes___tracedSVG' |
  'headshot___childImageSharp___sizes___aspectRatio' |
  'headshot___childImageSharp___sizes___src' |
  'headshot___childImageSharp___sizes___srcSet' |
  'headshot___childImageSharp___sizes___srcWebp' |
  'headshot___childImageSharp___sizes___srcSetWebp' |
  'headshot___childImageSharp___sizes___sizes' |
  'headshot___childImageSharp___sizes___originalImg' |
  'headshot___childImageSharp___sizes___originalName' |
  'headshot___childImageSharp___sizes___presentationWidth' |
  'headshot___childImageSharp___sizes___presentationHeight' |
  'headshot___childImageSharp___original___width' |
  'headshot___childImageSharp___original___height' |
  'headshot___childImageSharp___original___src' |
  'headshot___childImageSharp___resize___src' |
  'headshot___childImageSharp___resize___tracedSVG' |
  'headshot___childImageSharp___resize___width' |
  'headshot___childImageSharp___resize___height' |
  'headshot___childImageSharp___resize___aspectRatio' |
  'headshot___childImageSharp___resize___originalName' |
  'headshot___childImageSharp___id' |
  'headshot___childImageSharp___parent___id' |
  'headshot___childImageSharp___parent___children' |
  'headshot___childImageSharp___children' |
  'headshot___childImageSharp___children___id' |
  'headshot___childImageSharp___children___children' |
  'headshot___childImageSharp___internal___content' |
  'headshot___childImageSharp___internal___contentDigest' |
  'headshot___childImageSharp___internal___description' |
  'headshot___childImageSharp___internal___fieldOwners' |
  'headshot___childImageSharp___internal___ignoreType' |
  'headshot___childImageSharp___internal___mediaType' |
  'headshot___childImageSharp___internal___owner' |
  'headshot___childImageSharp___internal___type' |
  'headshot___id' |
  'headshot___parent___id' |
  'headshot___parent___parent___id' |
  'headshot___parent___parent___children' |
  'headshot___parent___children' |
  'headshot___parent___children___id' |
  'headshot___parent___children___children' |
  'headshot___parent___internal___content' |
  'headshot___parent___internal___contentDigest' |
  'headshot___parent___internal___description' |
  'headshot___parent___internal___fieldOwners' |
  'headshot___parent___internal___ignoreType' |
  'headshot___parent___internal___mediaType' |
  'headshot___parent___internal___owner' |
  'headshot___parent___internal___type' |
  'headshot___children' |
  'headshot___children___id' |
  'headshot___children___parent___id' |
  'headshot___children___parent___children' |
  'headshot___children___children' |
  'headshot___children___children___id' |
  'headshot___children___children___children' |
  'headshot___children___internal___content' |
  'headshot___children___internal___contentDigest' |
  'headshot___children___internal___description' |
  'headshot___children___internal___fieldOwners' |
  'headshot___children___internal___ignoreType' |
  'headshot___children___internal___mediaType' |
  'headshot___children___internal___owner' |
  'headshot___children___internal___type' |
  'headshot___internal___content' |
  'headshot___internal___contentDigest' |
  'headshot___internal___description' |
  'headshot___internal___fieldOwners' |
  'headshot___internal___ignoreType' |
  'headshot___internal___mediaType' |
  'headshot___internal___owner' |
  'headshot___internal___type' |
  'strapiId';

export type StrapiAuthorFilterInput = {
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>,
  given_name?: Maybe<StringQueryOperatorInput>,
  family_name?: Maybe<StringQueryOperatorInput>,
  middle_name?: Maybe<StringQueryOperatorInput>,
  membership?: Maybe<StringQueryOperatorInput>,
  homepage?: Maybe<StringQueryOperatorInput>,
  short_bio?: Maybe<StringQueryOperatorInput>,
  long_bio?: Maybe<StringQueryOperatorInput>,
  created_at?: Maybe<DateQueryOperatorInput>,
  updated_at?: Maybe<DateQueryOperatorInput>,
  links?: Maybe<StrapiAuthorLinksFilterListInput>,
  headshot?: Maybe<FileFilterInput>,
  strapiId?: Maybe<IntQueryOperatorInput>,
};

export type StrapiAuthorGroupConnection = {
  totalCount: Scalars['Int'],
  edges: Array<StrapiAuthorEdge>,
  nodes: Array<StrapiAuthor>,
  pageInfo: PageInfo,
  field: Scalars['String'],
  fieldValue?: Maybe<Scalars['String']>,
};

export type StrapiAuthorLinks = {
  id?: Maybe<Scalars['Int']>,
  description?: Maybe<Scalars['String']>,
  url?: Maybe<Scalars['String']>,
};

export type StrapiAuthorLinksFilterInput = {
  id?: Maybe<IntQueryOperatorInput>,
  description?: Maybe<StringQueryOperatorInput>,
  url?: Maybe<StringQueryOperatorInput>,
};

export type StrapiAuthorLinksFilterListInput = {
  elemMatch?: Maybe<StrapiAuthorLinksFilterInput>,
};

export type StrapiAuthorSortInput = {
  fields?: Maybe<Array<Maybe<StrapiAuthorFieldsEnum>>>,
  order?: Maybe<Array<Maybe<SortOrderEnum>>>,
};

export type StrapiPublication = Node & {
  id: Scalars['ID'],
  parent?: Maybe<Node>,
  children: Array<Node>,
  internal: Internal,
  title?: Maybe<Scalars['String']>,
  abstract?: Maybe<Scalars['String']>,
  venue_year?: Maybe<StrapiPublicationVenue_Year>,
  short_description?: Maybe<Scalars['String']>,
  pub_details?: Maybe<Scalars['String']>,
  award?: Maybe<Scalars['String']>,
  status?: Maybe<Scalars['String']>,
  award_description?: Maybe<Scalars['String']>,
  created_at?: Maybe<Scalars['Date']>,
  updated_at?: Maybe<Scalars['Date']>,
  small_thumbnail?: Maybe<File>,
  small_thumbnail_active?: Maybe<File>,
  image?: Maybe<File>,
  pdf?: Maybe<File>,
  authors?: Maybe<Array<Maybe<StrapiPublicationAuthors>>>,
  strapiId?: Maybe<Scalars['Int']>,
};


export type StrapiPublicationCreated_AtArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type StrapiPublicationUpdated_AtArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};

export type StrapiPublicationAuthors = {
  id?: Maybe<Scalars['Int']>,
  given_name?: Maybe<Scalars['String']>,
  family_name?: Maybe<Scalars['String']>,
  middle_name?: Maybe<Scalars['String']>,
  membership?: Maybe<Scalars['String']>,
  homepage?: Maybe<Scalars['String']>,
  short_bio?: Maybe<Scalars['String']>,
  long_bio?: Maybe<Scalars['String']>,
  created_at?: Maybe<Scalars['Date']>,
  updated_at?: Maybe<Scalars['Date']>,
  links?: Maybe<Array<Maybe<StrapiPublicationAuthorsLinks>>>,
  headshot?: Maybe<File>,
};


export type StrapiPublicationAuthorsCreated_AtArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type StrapiPublicationAuthorsUpdated_AtArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};

export type StrapiPublicationAuthorsFilterInput = {
  id?: Maybe<IntQueryOperatorInput>,
  given_name?: Maybe<StringQueryOperatorInput>,
  family_name?: Maybe<StringQueryOperatorInput>,
  middle_name?: Maybe<StringQueryOperatorInput>,
  membership?: Maybe<StringQueryOperatorInput>,
  homepage?: Maybe<StringQueryOperatorInput>,
  short_bio?: Maybe<StringQueryOperatorInput>,
  long_bio?: Maybe<StringQueryOperatorInput>,
  created_at?: Maybe<DateQueryOperatorInput>,
  updated_at?: Maybe<DateQueryOperatorInput>,
  links?: Maybe<StrapiPublicationAuthorsLinksFilterListInput>,
  headshot?: Maybe<FileFilterInput>,
};

export type StrapiPublicationAuthorsFilterListInput = {
  elemMatch?: Maybe<StrapiPublicationAuthorsFilterInput>,
};

export type StrapiPublicationAuthorsLinks = {
  id?: Maybe<Scalars['Int']>,
  description?: Maybe<Scalars['String']>,
  url?: Maybe<Scalars['String']>,
};

export type StrapiPublicationAuthorsLinksFilterInput = {
  id?: Maybe<IntQueryOperatorInput>,
  description?: Maybe<StringQueryOperatorInput>,
  url?: Maybe<StringQueryOperatorInput>,
};

export type StrapiPublicationAuthorsLinksFilterListInput = {
  elemMatch?: Maybe<StrapiPublicationAuthorsLinksFilterInput>,
};

export type StrapiPublicationConnection = {
  totalCount: Scalars['Int'],
  edges: Array<StrapiPublicationEdge>,
  nodes: Array<StrapiPublication>,
  pageInfo: PageInfo,
  distinct: Array<Scalars['String']>,
  group: Array<StrapiPublicationGroupConnection>,
};


export type StrapiPublicationConnectionDistinctArgs = {
  field: StrapiPublicationFieldsEnum
};


export type StrapiPublicationConnectionGroupArgs = {
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>,
  field: StrapiPublicationFieldsEnum
};

export type StrapiPublicationEdge = {
  next?: Maybe<StrapiPublication>,
  node: StrapiPublication,
  previous?: Maybe<StrapiPublication>,
};

export type StrapiPublicationFieldsEnum = 
  'id' |
  'parent___id' |
  'parent___parent___id' |
  'parent___parent___parent___id' |
  'parent___parent___parent___children' |
  'parent___parent___children' |
  'parent___parent___children___id' |
  'parent___parent___children___children' |
  'parent___parent___internal___content' |
  'parent___parent___internal___contentDigest' |
  'parent___parent___internal___description' |
  'parent___parent___internal___fieldOwners' |
  'parent___parent___internal___ignoreType' |
  'parent___parent___internal___mediaType' |
  'parent___parent___internal___owner' |
  'parent___parent___internal___type' |
  'parent___children' |
  'parent___children___id' |
  'parent___children___parent___id' |
  'parent___children___parent___children' |
  'parent___children___children' |
  'parent___children___children___id' |
  'parent___children___children___children' |
  'parent___children___internal___content' |
  'parent___children___internal___contentDigest' |
  'parent___children___internal___description' |
  'parent___children___internal___fieldOwners' |
  'parent___children___internal___ignoreType' |
  'parent___children___internal___mediaType' |
  'parent___children___internal___owner' |
  'parent___children___internal___type' |
  'parent___internal___content' |
  'parent___internal___contentDigest' |
  'parent___internal___description' |
  'parent___internal___fieldOwners' |
  'parent___internal___ignoreType' |
  'parent___internal___mediaType' |
  'parent___internal___owner' |
  'parent___internal___type' |
  'children' |
  'children___id' |
  'children___parent___id' |
  'children___parent___parent___id' |
  'children___parent___parent___children' |
  'children___parent___children' |
  'children___parent___children___id' |
  'children___parent___children___children' |
  'children___parent___internal___content' |
  'children___parent___internal___contentDigest' |
  'children___parent___internal___description' |
  'children___parent___internal___fieldOwners' |
  'children___parent___internal___ignoreType' |
  'children___parent___internal___mediaType' |
  'children___parent___internal___owner' |
  'children___parent___internal___type' |
  'children___children' |
  'children___children___id' |
  'children___children___parent___id' |
  'children___children___parent___children' |
  'children___children___children' |
  'children___children___children___id' |
  'children___children___children___children' |
  'children___children___internal___content' |
  'children___children___internal___contentDigest' |
  'children___children___internal___description' |
  'children___children___internal___fieldOwners' |
  'children___children___internal___ignoreType' |
  'children___children___internal___mediaType' |
  'children___children___internal___owner' |
  'children___children___internal___type' |
  'children___internal___content' |
  'children___internal___contentDigest' |
  'children___internal___description' |
  'children___internal___fieldOwners' |
  'children___internal___ignoreType' |
  'children___internal___mediaType' |
  'children___internal___owner' |
  'children___internal___type' |
  'internal___content' |
  'internal___contentDigest' |
  'internal___description' |
  'internal___fieldOwners' |
  'internal___ignoreType' |
  'internal___mediaType' |
  'internal___owner' |
  'internal___type' |
  'title' |
  'abstract' |
  'venue_year___id' |
  'venue_year___venue' |
  'venue_year___year' |
  'venue_year___location' |
  'venue_year___conference_start' |
  'venue_year___conference_end' |
  'venue_year___homepage' |
  'venue_year___created_at' |
  'venue_year___updated_at' |
  'short_description' |
  'pub_details' |
  'award' |
  'status' |
  'award_description' |
  'created_at' |
  'updated_at' |
  'small_thumbnail___sourceInstanceName' |
  'small_thumbnail___absolutePath' |
  'small_thumbnail___relativePath' |
  'small_thumbnail___extension' |
  'small_thumbnail___size' |
  'small_thumbnail___prettySize' |
  'small_thumbnail___modifiedTime' |
  'small_thumbnail___accessTime' |
  'small_thumbnail___changeTime' |
  'small_thumbnail___birthTime' |
  'small_thumbnail___root' |
  'small_thumbnail___dir' |
  'small_thumbnail___base' |
  'small_thumbnail___ext' |
  'small_thumbnail___name' |
  'small_thumbnail___relativeDirectory' |
  'small_thumbnail___dev' |
  'small_thumbnail___mode' |
  'small_thumbnail___nlink' |
  'small_thumbnail___uid' |
  'small_thumbnail___gid' |
  'small_thumbnail___rdev' |
  'small_thumbnail___ino' |
  'small_thumbnail___atimeMs' |
  'small_thumbnail___mtimeMs' |
  'small_thumbnail___ctimeMs' |
  'small_thumbnail___atime' |
  'small_thumbnail___mtime' |
  'small_thumbnail___ctime' |
  'small_thumbnail___birthtime' |
  'small_thumbnail___birthtimeMs' |
  'small_thumbnail___blksize' |
  'small_thumbnail___blocks' |
  'small_thumbnail___publicURL' |
  'small_thumbnail___childImageSharp___fixed___base64' |
  'small_thumbnail___childImageSharp___fixed___tracedSVG' |
  'small_thumbnail___childImageSharp___fixed___aspectRatio' |
  'small_thumbnail___childImageSharp___fixed___width' |
  'small_thumbnail___childImageSharp___fixed___height' |
  'small_thumbnail___childImageSharp___fixed___src' |
  'small_thumbnail___childImageSharp___fixed___srcSet' |
  'small_thumbnail___childImageSharp___fixed___srcWebp' |
  'small_thumbnail___childImageSharp___fixed___srcSetWebp' |
  'small_thumbnail___childImageSharp___fixed___originalName' |
  'small_thumbnail___childImageSharp___resolutions___base64' |
  'small_thumbnail___childImageSharp___resolutions___tracedSVG' |
  'small_thumbnail___childImageSharp___resolutions___aspectRatio' |
  'small_thumbnail___childImageSharp___resolutions___width' |
  'small_thumbnail___childImageSharp___resolutions___height' |
  'small_thumbnail___childImageSharp___resolutions___src' |
  'small_thumbnail___childImageSharp___resolutions___srcSet' |
  'small_thumbnail___childImageSharp___resolutions___srcWebp' |
  'small_thumbnail___childImageSharp___resolutions___srcSetWebp' |
  'small_thumbnail___childImageSharp___resolutions___originalName' |
  'small_thumbnail___childImageSharp___fluid___base64' |
  'small_thumbnail___childImageSharp___fluid___tracedSVG' |
  'small_thumbnail___childImageSharp___fluid___aspectRatio' |
  'small_thumbnail___childImageSharp___fluid___src' |
  'small_thumbnail___childImageSharp___fluid___srcSet' |
  'small_thumbnail___childImageSharp___fluid___srcWebp' |
  'small_thumbnail___childImageSharp___fluid___srcSetWebp' |
  'small_thumbnail___childImageSharp___fluid___sizes' |
  'small_thumbnail___childImageSharp___fluid___originalImg' |
  'small_thumbnail___childImageSharp___fluid___originalName' |
  'small_thumbnail___childImageSharp___fluid___presentationWidth' |
  'small_thumbnail___childImageSharp___fluid___presentationHeight' |
  'small_thumbnail___childImageSharp___sizes___base64' |
  'small_thumbnail___childImageSharp___sizes___tracedSVG' |
  'small_thumbnail___childImageSharp___sizes___aspectRatio' |
  'small_thumbnail___childImageSharp___sizes___src' |
  'small_thumbnail___childImageSharp___sizes___srcSet' |
  'small_thumbnail___childImageSharp___sizes___srcWebp' |
  'small_thumbnail___childImageSharp___sizes___srcSetWebp' |
  'small_thumbnail___childImageSharp___sizes___sizes' |
  'small_thumbnail___childImageSharp___sizes___originalImg' |
  'small_thumbnail___childImageSharp___sizes___originalName' |
  'small_thumbnail___childImageSharp___sizes___presentationWidth' |
  'small_thumbnail___childImageSharp___sizes___presentationHeight' |
  'small_thumbnail___childImageSharp___original___width' |
  'small_thumbnail___childImageSharp___original___height' |
  'small_thumbnail___childImageSharp___original___src' |
  'small_thumbnail___childImageSharp___resize___src' |
  'small_thumbnail___childImageSharp___resize___tracedSVG' |
  'small_thumbnail___childImageSharp___resize___width' |
  'small_thumbnail___childImageSharp___resize___height' |
  'small_thumbnail___childImageSharp___resize___aspectRatio' |
  'small_thumbnail___childImageSharp___resize___originalName' |
  'small_thumbnail___childImageSharp___id' |
  'small_thumbnail___childImageSharp___parent___id' |
  'small_thumbnail___childImageSharp___parent___children' |
  'small_thumbnail___childImageSharp___children' |
  'small_thumbnail___childImageSharp___children___id' |
  'small_thumbnail___childImageSharp___children___children' |
  'small_thumbnail___childImageSharp___internal___content' |
  'small_thumbnail___childImageSharp___internal___contentDigest' |
  'small_thumbnail___childImageSharp___internal___description' |
  'small_thumbnail___childImageSharp___internal___fieldOwners' |
  'small_thumbnail___childImageSharp___internal___ignoreType' |
  'small_thumbnail___childImageSharp___internal___mediaType' |
  'small_thumbnail___childImageSharp___internal___owner' |
  'small_thumbnail___childImageSharp___internal___type' |
  'small_thumbnail___id' |
  'small_thumbnail___parent___id' |
  'small_thumbnail___parent___parent___id' |
  'small_thumbnail___parent___parent___children' |
  'small_thumbnail___parent___children' |
  'small_thumbnail___parent___children___id' |
  'small_thumbnail___parent___children___children' |
  'small_thumbnail___parent___internal___content' |
  'small_thumbnail___parent___internal___contentDigest' |
  'small_thumbnail___parent___internal___description' |
  'small_thumbnail___parent___internal___fieldOwners' |
  'small_thumbnail___parent___internal___ignoreType' |
  'small_thumbnail___parent___internal___mediaType' |
  'small_thumbnail___parent___internal___owner' |
  'small_thumbnail___parent___internal___type' |
  'small_thumbnail___children' |
  'small_thumbnail___children___id' |
  'small_thumbnail___children___parent___id' |
  'small_thumbnail___children___parent___children' |
  'small_thumbnail___children___children' |
  'small_thumbnail___children___children___id' |
  'small_thumbnail___children___children___children' |
  'small_thumbnail___children___internal___content' |
  'small_thumbnail___children___internal___contentDigest' |
  'small_thumbnail___children___internal___description' |
  'small_thumbnail___children___internal___fieldOwners' |
  'small_thumbnail___children___internal___ignoreType' |
  'small_thumbnail___children___internal___mediaType' |
  'small_thumbnail___children___internal___owner' |
  'small_thumbnail___children___internal___type' |
  'small_thumbnail___internal___content' |
  'small_thumbnail___internal___contentDigest' |
  'small_thumbnail___internal___description' |
  'small_thumbnail___internal___fieldOwners' |
  'small_thumbnail___internal___ignoreType' |
  'small_thumbnail___internal___mediaType' |
  'small_thumbnail___internal___owner' |
  'small_thumbnail___internal___type' |
  'small_thumbnail_active___sourceInstanceName' |
  'small_thumbnail_active___absolutePath' |
  'small_thumbnail_active___relativePath' |
  'small_thumbnail_active___extension' |
  'small_thumbnail_active___size' |
  'small_thumbnail_active___prettySize' |
  'small_thumbnail_active___modifiedTime' |
  'small_thumbnail_active___accessTime' |
  'small_thumbnail_active___changeTime' |
  'small_thumbnail_active___birthTime' |
  'small_thumbnail_active___root' |
  'small_thumbnail_active___dir' |
  'small_thumbnail_active___base' |
  'small_thumbnail_active___ext' |
  'small_thumbnail_active___name' |
  'small_thumbnail_active___relativeDirectory' |
  'small_thumbnail_active___dev' |
  'small_thumbnail_active___mode' |
  'small_thumbnail_active___nlink' |
  'small_thumbnail_active___uid' |
  'small_thumbnail_active___gid' |
  'small_thumbnail_active___rdev' |
  'small_thumbnail_active___ino' |
  'small_thumbnail_active___atimeMs' |
  'small_thumbnail_active___mtimeMs' |
  'small_thumbnail_active___ctimeMs' |
  'small_thumbnail_active___atime' |
  'small_thumbnail_active___mtime' |
  'small_thumbnail_active___ctime' |
  'small_thumbnail_active___birthtime' |
  'small_thumbnail_active___birthtimeMs' |
  'small_thumbnail_active___blksize' |
  'small_thumbnail_active___blocks' |
  'small_thumbnail_active___publicURL' |
  'small_thumbnail_active___childImageSharp___fixed___base64' |
  'small_thumbnail_active___childImageSharp___fixed___tracedSVG' |
  'small_thumbnail_active___childImageSharp___fixed___aspectRatio' |
  'small_thumbnail_active___childImageSharp___fixed___width' |
  'small_thumbnail_active___childImageSharp___fixed___height' |
  'small_thumbnail_active___childImageSharp___fixed___src' |
  'small_thumbnail_active___childImageSharp___fixed___srcSet' |
  'small_thumbnail_active___childImageSharp___fixed___srcWebp' |
  'small_thumbnail_active___childImageSharp___fixed___srcSetWebp' |
  'small_thumbnail_active___childImageSharp___fixed___originalName' |
  'small_thumbnail_active___childImageSharp___resolutions___base64' |
  'small_thumbnail_active___childImageSharp___resolutions___tracedSVG' |
  'small_thumbnail_active___childImageSharp___resolutions___aspectRatio' |
  'small_thumbnail_active___childImageSharp___resolutions___width' |
  'small_thumbnail_active___childImageSharp___resolutions___height' |
  'small_thumbnail_active___childImageSharp___resolutions___src' |
  'small_thumbnail_active___childImageSharp___resolutions___srcSet' |
  'small_thumbnail_active___childImageSharp___resolutions___srcWebp' |
  'small_thumbnail_active___childImageSharp___resolutions___srcSetWebp' |
  'small_thumbnail_active___childImageSharp___resolutions___originalName' |
  'small_thumbnail_active___childImageSharp___fluid___base64' |
  'small_thumbnail_active___childImageSharp___fluid___tracedSVG' |
  'small_thumbnail_active___childImageSharp___fluid___aspectRatio' |
  'small_thumbnail_active___childImageSharp___fluid___src' |
  'small_thumbnail_active___childImageSharp___fluid___srcSet' |
  'small_thumbnail_active___childImageSharp___fluid___srcWebp' |
  'small_thumbnail_active___childImageSharp___fluid___srcSetWebp' |
  'small_thumbnail_active___childImageSharp___fluid___sizes' |
  'small_thumbnail_active___childImageSharp___fluid___originalImg' |
  'small_thumbnail_active___childImageSharp___fluid___originalName' |
  'small_thumbnail_active___childImageSharp___fluid___presentationWidth' |
  'small_thumbnail_active___childImageSharp___fluid___presentationHeight' |
  'small_thumbnail_active___childImageSharp___sizes___base64' |
  'small_thumbnail_active___childImageSharp___sizes___tracedSVG' |
  'small_thumbnail_active___childImageSharp___sizes___aspectRatio' |
  'small_thumbnail_active___childImageSharp___sizes___src' |
  'small_thumbnail_active___childImageSharp___sizes___srcSet' |
  'small_thumbnail_active___childImageSharp___sizes___srcWebp' |
  'small_thumbnail_active___childImageSharp___sizes___srcSetWebp' |
  'small_thumbnail_active___childImageSharp___sizes___sizes' |
  'small_thumbnail_active___childImageSharp___sizes___originalImg' |
  'small_thumbnail_active___childImageSharp___sizes___originalName' |
  'small_thumbnail_active___childImageSharp___sizes___presentationWidth' |
  'small_thumbnail_active___childImageSharp___sizes___presentationHeight' |
  'small_thumbnail_active___childImageSharp___original___width' |
  'small_thumbnail_active___childImageSharp___original___height' |
  'small_thumbnail_active___childImageSharp___original___src' |
  'small_thumbnail_active___childImageSharp___resize___src' |
  'small_thumbnail_active___childImageSharp___resize___tracedSVG' |
  'small_thumbnail_active___childImageSharp___resize___width' |
  'small_thumbnail_active___childImageSharp___resize___height' |
  'small_thumbnail_active___childImageSharp___resize___aspectRatio' |
  'small_thumbnail_active___childImageSharp___resize___originalName' |
  'small_thumbnail_active___childImageSharp___id' |
  'small_thumbnail_active___childImageSharp___parent___id' |
  'small_thumbnail_active___childImageSharp___parent___children' |
  'small_thumbnail_active___childImageSharp___children' |
  'small_thumbnail_active___childImageSharp___children___id' |
  'small_thumbnail_active___childImageSharp___children___children' |
  'small_thumbnail_active___childImageSharp___internal___content' |
  'small_thumbnail_active___childImageSharp___internal___contentDigest' |
  'small_thumbnail_active___childImageSharp___internal___description' |
  'small_thumbnail_active___childImageSharp___internal___fieldOwners' |
  'small_thumbnail_active___childImageSharp___internal___ignoreType' |
  'small_thumbnail_active___childImageSharp___internal___mediaType' |
  'small_thumbnail_active___childImageSharp___internal___owner' |
  'small_thumbnail_active___childImageSharp___internal___type' |
  'small_thumbnail_active___id' |
  'small_thumbnail_active___parent___id' |
  'small_thumbnail_active___parent___parent___id' |
  'small_thumbnail_active___parent___parent___children' |
  'small_thumbnail_active___parent___children' |
  'small_thumbnail_active___parent___children___id' |
  'small_thumbnail_active___parent___children___children' |
  'small_thumbnail_active___parent___internal___content' |
  'small_thumbnail_active___parent___internal___contentDigest' |
  'small_thumbnail_active___parent___internal___description' |
  'small_thumbnail_active___parent___internal___fieldOwners' |
  'small_thumbnail_active___parent___internal___ignoreType' |
  'small_thumbnail_active___parent___internal___mediaType' |
  'small_thumbnail_active___parent___internal___owner' |
  'small_thumbnail_active___parent___internal___type' |
  'small_thumbnail_active___children' |
  'small_thumbnail_active___children___id' |
  'small_thumbnail_active___children___parent___id' |
  'small_thumbnail_active___children___parent___children' |
  'small_thumbnail_active___children___children' |
  'small_thumbnail_active___children___children___id' |
  'small_thumbnail_active___children___children___children' |
  'small_thumbnail_active___children___internal___content' |
  'small_thumbnail_active___children___internal___contentDigest' |
  'small_thumbnail_active___children___internal___description' |
  'small_thumbnail_active___children___internal___fieldOwners' |
  'small_thumbnail_active___children___internal___ignoreType' |
  'small_thumbnail_active___children___internal___mediaType' |
  'small_thumbnail_active___children___internal___owner' |
  'small_thumbnail_active___children___internal___type' |
  'small_thumbnail_active___internal___content' |
  'small_thumbnail_active___internal___contentDigest' |
  'small_thumbnail_active___internal___description' |
  'small_thumbnail_active___internal___fieldOwners' |
  'small_thumbnail_active___internal___ignoreType' |
  'small_thumbnail_active___internal___mediaType' |
  'small_thumbnail_active___internal___owner' |
  'small_thumbnail_active___internal___type' |
  'image___sourceInstanceName' |
  'image___absolutePath' |
  'image___relativePath' |
  'image___extension' |
  'image___size' |
  'image___prettySize' |
  'image___modifiedTime' |
  'image___accessTime' |
  'image___changeTime' |
  'image___birthTime' |
  'image___root' |
  'image___dir' |
  'image___base' |
  'image___ext' |
  'image___name' |
  'image___relativeDirectory' |
  'image___dev' |
  'image___mode' |
  'image___nlink' |
  'image___uid' |
  'image___gid' |
  'image___rdev' |
  'image___ino' |
  'image___atimeMs' |
  'image___mtimeMs' |
  'image___ctimeMs' |
  'image___atime' |
  'image___mtime' |
  'image___ctime' |
  'image___birthtime' |
  'image___birthtimeMs' |
  'image___blksize' |
  'image___blocks' |
  'image___publicURL' |
  'image___childImageSharp___fixed___base64' |
  'image___childImageSharp___fixed___tracedSVG' |
  'image___childImageSharp___fixed___aspectRatio' |
  'image___childImageSharp___fixed___width' |
  'image___childImageSharp___fixed___height' |
  'image___childImageSharp___fixed___src' |
  'image___childImageSharp___fixed___srcSet' |
  'image___childImageSharp___fixed___srcWebp' |
  'image___childImageSharp___fixed___srcSetWebp' |
  'image___childImageSharp___fixed___originalName' |
  'image___childImageSharp___resolutions___base64' |
  'image___childImageSharp___resolutions___tracedSVG' |
  'image___childImageSharp___resolutions___aspectRatio' |
  'image___childImageSharp___resolutions___width' |
  'image___childImageSharp___resolutions___height' |
  'image___childImageSharp___resolutions___src' |
  'image___childImageSharp___resolutions___srcSet' |
  'image___childImageSharp___resolutions___srcWebp' |
  'image___childImageSharp___resolutions___srcSetWebp' |
  'image___childImageSharp___resolutions___originalName' |
  'image___childImageSharp___fluid___base64' |
  'image___childImageSharp___fluid___tracedSVG' |
  'image___childImageSharp___fluid___aspectRatio' |
  'image___childImageSharp___fluid___src' |
  'image___childImageSharp___fluid___srcSet' |
  'image___childImageSharp___fluid___srcWebp' |
  'image___childImageSharp___fluid___srcSetWebp' |
  'image___childImageSharp___fluid___sizes' |
  'image___childImageSharp___fluid___originalImg' |
  'image___childImageSharp___fluid___originalName' |
  'image___childImageSharp___fluid___presentationWidth' |
  'image___childImageSharp___fluid___presentationHeight' |
  'image___childImageSharp___sizes___base64' |
  'image___childImageSharp___sizes___tracedSVG' |
  'image___childImageSharp___sizes___aspectRatio' |
  'image___childImageSharp___sizes___src' |
  'image___childImageSharp___sizes___srcSet' |
  'image___childImageSharp___sizes___srcWebp' |
  'image___childImageSharp___sizes___srcSetWebp' |
  'image___childImageSharp___sizes___sizes' |
  'image___childImageSharp___sizes___originalImg' |
  'image___childImageSharp___sizes___originalName' |
  'image___childImageSharp___sizes___presentationWidth' |
  'image___childImageSharp___sizes___presentationHeight' |
  'image___childImageSharp___original___width' |
  'image___childImageSharp___original___height' |
  'image___childImageSharp___original___src' |
  'image___childImageSharp___resize___src' |
  'image___childImageSharp___resize___tracedSVG' |
  'image___childImageSharp___resize___width' |
  'image___childImageSharp___resize___height' |
  'image___childImageSharp___resize___aspectRatio' |
  'image___childImageSharp___resize___originalName' |
  'image___childImageSharp___id' |
  'image___childImageSharp___parent___id' |
  'image___childImageSharp___parent___children' |
  'image___childImageSharp___children' |
  'image___childImageSharp___children___id' |
  'image___childImageSharp___children___children' |
  'image___childImageSharp___internal___content' |
  'image___childImageSharp___internal___contentDigest' |
  'image___childImageSharp___internal___description' |
  'image___childImageSharp___internal___fieldOwners' |
  'image___childImageSharp___internal___ignoreType' |
  'image___childImageSharp___internal___mediaType' |
  'image___childImageSharp___internal___owner' |
  'image___childImageSharp___internal___type' |
  'image___id' |
  'image___parent___id' |
  'image___parent___parent___id' |
  'image___parent___parent___children' |
  'image___parent___children' |
  'image___parent___children___id' |
  'image___parent___children___children' |
  'image___parent___internal___content' |
  'image___parent___internal___contentDigest' |
  'image___parent___internal___description' |
  'image___parent___internal___fieldOwners' |
  'image___parent___internal___ignoreType' |
  'image___parent___internal___mediaType' |
  'image___parent___internal___owner' |
  'image___parent___internal___type' |
  'image___children' |
  'image___children___id' |
  'image___children___parent___id' |
  'image___children___parent___children' |
  'image___children___children' |
  'image___children___children___id' |
  'image___children___children___children' |
  'image___children___internal___content' |
  'image___children___internal___contentDigest' |
  'image___children___internal___description' |
  'image___children___internal___fieldOwners' |
  'image___children___internal___ignoreType' |
  'image___children___internal___mediaType' |
  'image___children___internal___owner' |
  'image___children___internal___type' |
  'image___internal___content' |
  'image___internal___contentDigest' |
  'image___internal___description' |
  'image___internal___fieldOwners' |
  'image___internal___ignoreType' |
  'image___internal___mediaType' |
  'image___internal___owner' |
  'image___internal___type' |
  'pdf___sourceInstanceName' |
  'pdf___absolutePath' |
  'pdf___relativePath' |
  'pdf___extension' |
  'pdf___size' |
  'pdf___prettySize' |
  'pdf___modifiedTime' |
  'pdf___accessTime' |
  'pdf___changeTime' |
  'pdf___birthTime' |
  'pdf___root' |
  'pdf___dir' |
  'pdf___base' |
  'pdf___ext' |
  'pdf___name' |
  'pdf___relativeDirectory' |
  'pdf___dev' |
  'pdf___mode' |
  'pdf___nlink' |
  'pdf___uid' |
  'pdf___gid' |
  'pdf___rdev' |
  'pdf___ino' |
  'pdf___atimeMs' |
  'pdf___mtimeMs' |
  'pdf___ctimeMs' |
  'pdf___atime' |
  'pdf___mtime' |
  'pdf___ctime' |
  'pdf___birthtime' |
  'pdf___birthtimeMs' |
  'pdf___blksize' |
  'pdf___blocks' |
  'pdf___publicURL' |
  'pdf___childImageSharp___fixed___base64' |
  'pdf___childImageSharp___fixed___tracedSVG' |
  'pdf___childImageSharp___fixed___aspectRatio' |
  'pdf___childImageSharp___fixed___width' |
  'pdf___childImageSharp___fixed___height' |
  'pdf___childImageSharp___fixed___src' |
  'pdf___childImageSharp___fixed___srcSet' |
  'pdf___childImageSharp___fixed___srcWebp' |
  'pdf___childImageSharp___fixed___srcSetWebp' |
  'pdf___childImageSharp___fixed___originalName' |
  'pdf___childImageSharp___resolutions___base64' |
  'pdf___childImageSharp___resolutions___tracedSVG' |
  'pdf___childImageSharp___resolutions___aspectRatio' |
  'pdf___childImageSharp___resolutions___width' |
  'pdf___childImageSharp___resolutions___height' |
  'pdf___childImageSharp___resolutions___src' |
  'pdf___childImageSharp___resolutions___srcSet' |
  'pdf___childImageSharp___resolutions___srcWebp' |
  'pdf___childImageSharp___resolutions___srcSetWebp' |
  'pdf___childImageSharp___resolutions___originalName' |
  'pdf___childImageSharp___fluid___base64' |
  'pdf___childImageSharp___fluid___tracedSVG' |
  'pdf___childImageSharp___fluid___aspectRatio' |
  'pdf___childImageSharp___fluid___src' |
  'pdf___childImageSharp___fluid___srcSet' |
  'pdf___childImageSharp___fluid___srcWebp' |
  'pdf___childImageSharp___fluid___srcSetWebp' |
  'pdf___childImageSharp___fluid___sizes' |
  'pdf___childImageSharp___fluid___originalImg' |
  'pdf___childImageSharp___fluid___originalName' |
  'pdf___childImageSharp___fluid___presentationWidth' |
  'pdf___childImageSharp___fluid___presentationHeight' |
  'pdf___childImageSharp___sizes___base64' |
  'pdf___childImageSharp___sizes___tracedSVG' |
  'pdf___childImageSharp___sizes___aspectRatio' |
  'pdf___childImageSharp___sizes___src' |
  'pdf___childImageSharp___sizes___srcSet' |
  'pdf___childImageSharp___sizes___srcWebp' |
  'pdf___childImageSharp___sizes___srcSetWebp' |
  'pdf___childImageSharp___sizes___sizes' |
  'pdf___childImageSharp___sizes___originalImg' |
  'pdf___childImageSharp___sizes___originalName' |
  'pdf___childImageSharp___sizes___presentationWidth' |
  'pdf___childImageSharp___sizes___presentationHeight' |
  'pdf___childImageSharp___original___width' |
  'pdf___childImageSharp___original___height' |
  'pdf___childImageSharp___original___src' |
  'pdf___childImageSharp___resize___src' |
  'pdf___childImageSharp___resize___tracedSVG' |
  'pdf___childImageSharp___resize___width' |
  'pdf___childImageSharp___resize___height' |
  'pdf___childImageSharp___resize___aspectRatio' |
  'pdf___childImageSharp___resize___originalName' |
  'pdf___childImageSharp___id' |
  'pdf___childImageSharp___parent___id' |
  'pdf___childImageSharp___parent___children' |
  'pdf___childImageSharp___children' |
  'pdf___childImageSharp___children___id' |
  'pdf___childImageSharp___children___children' |
  'pdf___childImageSharp___internal___content' |
  'pdf___childImageSharp___internal___contentDigest' |
  'pdf___childImageSharp___internal___description' |
  'pdf___childImageSharp___internal___fieldOwners' |
  'pdf___childImageSharp___internal___ignoreType' |
  'pdf___childImageSharp___internal___mediaType' |
  'pdf___childImageSharp___internal___owner' |
  'pdf___childImageSharp___internal___type' |
  'pdf___id' |
  'pdf___parent___id' |
  'pdf___parent___parent___id' |
  'pdf___parent___parent___children' |
  'pdf___parent___children' |
  'pdf___parent___children___id' |
  'pdf___parent___children___children' |
  'pdf___parent___internal___content' |
  'pdf___parent___internal___contentDigest' |
  'pdf___parent___internal___description' |
  'pdf___parent___internal___fieldOwners' |
  'pdf___parent___internal___ignoreType' |
  'pdf___parent___internal___mediaType' |
  'pdf___parent___internal___owner' |
  'pdf___parent___internal___type' |
  'pdf___children' |
  'pdf___children___id' |
  'pdf___children___parent___id' |
  'pdf___children___parent___children' |
  'pdf___children___children' |
  'pdf___children___children___id' |
  'pdf___children___children___children' |
  'pdf___children___internal___content' |
  'pdf___children___internal___contentDigest' |
  'pdf___children___internal___description' |
  'pdf___children___internal___fieldOwners' |
  'pdf___children___internal___ignoreType' |
  'pdf___children___internal___mediaType' |
  'pdf___children___internal___owner' |
  'pdf___children___internal___type' |
  'pdf___internal___content' |
  'pdf___internal___contentDigest' |
  'pdf___internal___description' |
  'pdf___internal___fieldOwners' |
  'pdf___internal___ignoreType' |
  'pdf___internal___mediaType' |
  'pdf___internal___owner' |
  'pdf___internal___type' |
  'authors' |
  'authors___id' |
  'authors___given_name' |
  'authors___family_name' |
  'authors___middle_name' |
  'authors___membership' |
  'authors___homepage' |
  'authors___short_bio' |
  'authors___long_bio' |
  'authors___created_at' |
  'authors___updated_at' |
  'authors___links' |
  'authors___links___id' |
  'authors___links___description' |
  'authors___links___url' |
  'authors___headshot___sourceInstanceName' |
  'authors___headshot___absolutePath' |
  'authors___headshot___relativePath' |
  'authors___headshot___extension' |
  'authors___headshot___size' |
  'authors___headshot___prettySize' |
  'authors___headshot___modifiedTime' |
  'authors___headshot___accessTime' |
  'authors___headshot___changeTime' |
  'authors___headshot___birthTime' |
  'authors___headshot___root' |
  'authors___headshot___dir' |
  'authors___headshot___base' |
  'authors___headshot___ext' |
  'authors___headshot___name' |
  'authors___headshot___relativeDirectory' |
  'authors___headshot___dev' |
  'authors___headshot___mode' |
  'authors___headshot___nlink' |
  'authors___headshot___uid' |
  'authors___headshot___gid' |
  'authors___headshot___rdev' |
  'authors___headshot___ino' |
  'authors___headshot___atimeMs' |
  'authors___headshot___mtimeMs' |
  'authors___headshot___ctimeMs' |
  'authors___headshot___atime' |
  'authors___headshot___mtime' |
  'authors___headshot___ctime' |
  'authors___headshot___birthtime' |
  'authors___headshot___birthtimeMs' |
  'authors___headshot___blksize' |
  'authors___headshot___blocks' |
  'authors___headshot___publicURL' |
  'authors___headshot___childImageSharp___id' |
  'authors___headshot___childImageSharp___children' |
  'authors___headshot___id' |
  'authors___headshot___parent___id' |
  'authors___headshot___parent___children' |
  'authors___headshot___children' |
  'authors___headshot___children___id' |
  'authors___headshot___children___children' |
  'authors___headshot___internal___content' |
  'authors___headshot___internal___contentDigest' |
  'authors___headshot___internal___description' |
  'authors___headshot___internal___fieldOwners' |
  'authors___headshot___internal___ignoreType' |
  'authors___headshot___internal___mediaType' |
  'authors___headshot___internal___owner' |
  'authors___headshot___internal___type' |
  'strapiId';

export type StrapiPublicationFilterInput = {
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>,
  title?: Maybe<StringQueryOperatorInput>,
  abstract?: Maybe<StringQueryOperatorInput>,
  venue_year?: Maybe<StrapiPublicationVenue_YearFilterInput>,
  short_description?: Maybe<StringQueryOperatorInput>,
  pub_details?: Maybe<StringQueryOperatorInput>,
  award?: Maybe<StringQueryOperatorInput>,
  status?: Maybe<StringQueryOperatorInput>,
  award_description?: Maybe<StringQueryOperatorInput>,
  created_at?: Maybe<DateQueryOperatorInput>,
  updated_at?: Maybe<DateQueryOperatorInput>,
  small_thumbnail?: Maybe<FileFilterInput>,
  small_thumbnail_active?: Maybe<FileFilterInput>,
  image?: Maybe<FileFilterInput>,
  pdf?: Maybe<FileFilterInput>,
  authors?: Maybe<StrapiPublicationAuthorsFilterListInput>,
  strapiId?: Maybe<IntQueryOperatorInput>,
};

export type StrapiPublicationGroupConnection = {
  totalCount: Scalars['Int'],
  edges: Array<StrapiPublicationEdge>,
  nodes: Array<StrapiPublication>,
  pageInfo: PageInfo,
  field: Scalars['String'],
  fieldValue?: Maybe<Scalars['String']>,
};

export type StrapiPublicationSortInput = {
  fields?: Maybe<Array<Maybe<StrapiPublicationFieldsEnum>>>,
  order?: Maybe<Array<Maybe<SortOrderEnum>>>,
};

export type StrapiPublicationVenue_Year = {
  id?: Maybe<Scalars['Int']>,
  venue?: Maybe<Scalars['Int']>,
  year?: Maybe<Scalars['Int']>,
  location?: Maybe<Scalars['String']>,
  conference_start?: Maybe<Scalars['Date']>,
  conference_end?: Maybe<Scalars['Date']>,
  homepage?: Maybe<Scalars['String']>,
  created_at?: Maybe<Scalars['Date']>,
  updated_at?: Maybe<Scalars['Date']>,
};


export type StrapiPublicationVenue_YearConference_StartArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type StrapiPublicationVenue_YearConference_EndArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type StrapiPublicationVenue_YearCreated_AtArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type StrapiPublicationVenue_YearUpdated_AtArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};

export type StrapiPublicationVenue_YearFilterInput = {
  id?: Maybe<IntQueryOperatorInput>,
  venue?: Maybe<IntQueryOperatorInput>,
  year?: Maybe<IntQueryOperatorInput>,
  location?: Maybe<StringQueryOperatorInput>,
  conference_start?: Maybe<DateQueryOperatorInput>,
  conference_end?: Maybe<DateQueryOperatorInput>,
  homepage?: Maybe<StringQueryOperatorInput>,
  created_at?: Maybe<DateQueryOperatorInput>,
  updated_at?: Maybe<DateQueryOperatorInput>,
};

export type StrapiVenue = Node & {
  id: Scalars['ID'],
  parent?: Maybe<Node>,
  children: Array<Node>,
  internal: Internal,
  short_name?: Maybe<Scalars['String']>,
  long_name?: Maybe<Scalars['String']>,
  type?: Maybe<Scalars['String']>,
  created_at?: Maybe<Scalars['Date']>,
  updated_at?: Maybe<Scalars['Date']>,
  venue_years?: Maybe<Array<Maybe<StrapiVenueVenue_Years>>>,
  strapiId?: Maybe<Scalars['Int']>,
};


export type StrapiVenueCreated_AtArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type StrapiVenueUpdated_AtArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};

export type StrapiVenueConnection = {
  totalCount: Scalars['Int'],
  edges: Array<StrapiVenueEdge>,
  nodes: Array<StrapiVenue>,
  pageInfo: PageInfo,
  distinct: Array<Scalars['String']>,
  group: Array<StrapiVenueGroupConnection>,
};


export type StrapiVenueConnectionDistinctArgs = {
  field: StrapiVenueFieldsEnum
};


export type StrapiVenueConnectionGroupArgs = {
  skip?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>,
  field: StrapiVenueFieldsEnum
};

export type StrapiVenueEdge = {
  next?: Maybe<StrapiVenue>,
  node: StrapiVenue,
  previous?: Maybe<StrapiVenue>,
};

export type StrapiVenueFieldsEnum = 
  'id' |
  'parent___id' |
  'parent___parent___id' |
  'parent___parent___parent___id' |
  'parent___parent___parent___children' |
  'parent___parent___children' |
  'parent___parent___children___id' |
  'parent___parent___children___children' |
  'parent___parent___internal___content' |
  'parent___parent___internal___contentDigest' |
  'parent___parent___internal___description' |
  'parent___parent___internal___fieldOwners' |
  'parent___parent___internal___ignoreType' |
  'parent___parent___internal___mediaType' |
  'parent___parent___internal___owner' |
  'parent___parent___internal___type' |
  'parent___children' |
  'parent___children___id' |
  'parent___children___parent___id' |
  'parent___children___parent___children' |
  'parent___children___children' |
  'parent___children___children___id' |
  'parent___children___children___children' |
  'parent___children___internal___content' |
  'parent___children___internal___contentDigest' |
  'parent___children___internal___description' |
  'parent___children___internal___fieldOwners' |
  'parent___children___internal___ignoreType' |
  'parent___children___internal___mediaType' |
  'parent___children___internal___owner' |
  'parent___children___internal___type' |
  'parent___internal___content' |
  'parent___internal___contentDigest' |
  'parent___internal___description' |
  'parent___internal___fieldOwners' |
  'parent___internal___ignoreType' |
  'parent___internal___mediaType' |
  'parent___internal___owner' |
  'parent___internal___type' |
  'children' |
  'children___id' |
  'children___parent___id' |
  'children___parent___parent___id' |
  'children___parent___parent___children' |
  'children___parent___children' |
  'children___parent___children___id' |
  'children___parent___children___children' |
  'children___parent___internal___content' |
  'children___parent___internal___contentDigest' |
  'children___parent___internal___description' |
  'children___parent___internal___fieldOwners' |
  'children___parent___internal___ignoreType' |
  'children___parent___internal___mediaType' |
  'children___parent___internal___owner' |
  'children___parent___internal___type' |
  'children___children' |
  'children___children___id' |
  'children___children___parent___id' |
  'children___children___parent___children' |
  'children___children___children' |
  'children___children___children___id' |
  'children___children___children___children' |
  'children___children___internal___content' |
  'children___children___internal___contentDigest' |
  'children___children___internal___description' |
  'children___children___internal___fieldOwners' |
  'children___children___internal___ignoreType' |
  'children___children___internal___mediaType' |
  'children___children___internal___owner' |
  'children___children___internal___type' |
  'children___internal___content' |
  'children___internal___contentDigest' |
  'children___internal___description' |
  'children___internal___fieldOwners' |
  'children___internal___ignoreType' |
  'children___internal___mediaType' |
  'children___internal___owner' |
  'children___internal___type' |
  'internal___content' |
  'internal___contentDigest' |
  'internal___description' |
  'internal___fieldOwners' |
  'internal___ignoreType' |
  'internal___mediaType' |
  'internal___owner' |
  'internal___type' |
  'short_name' |
  'long_name' |
  'type' |
  'created_at' |
  'updated_at' |
  'venue_years' |
  'venue_years___id' |
  'venue_years___venue' |
  'venue_years___year' |
  'venue_years___location' |
  'venue_years___conference_start' |
  'venue_years___conference_end' |
  'venue_years___homepage' |
  'venue_years___created_at' |
  'venue_years___updated_at' |
  'strapiId';

export type StrapiVenueFilterInput = {
  id?: Maybe<StringQueryOperatorInput>,
  parent?: Maybe<NodeFilterInput>,
  children?: Maybe<NodeFilterListInput>,
  internal?: Maybe<InternalFilterInput>,
  short_name?: Maybe<StringQueryOperatorInput>,
  long_name?: Maybe<StringQueryOperatorInput>,
  type?: Maybe<StringQueryOperatorInput>,
  created_at?: Maybe<DateQueryOperatorInput>,
  updated_at?: Maybe<DateQueryOperatorInput>,
  venue_years?: Maybe<StrapiVenueVenue_YearsFilterListInput>,
  strapiId?: Maybe<IntQueryOperatorInput>,
};

export type StrapiVenueGroupConnection = {
  totalCount: Scalars['Int'],
  edges: Array<StrapiVenueEdge>,
  nodes: Array<StrapiVenue>,
  pageInfo: PageInfo,
  field: Scalars['String'],
  fieldValue?: Maybe<Scalars['String']>,
};

export type StrapiVenueSortInput = {
  fields?: Maybe<Array<Maybe<StrapiVenueFieldsEnum>>>,
  order?: Maybe<Array<Maybe<SortOrderEnum>>>,
};

export type StrapiVenueVenue_Years = {
  id?: Maybe<Scalars['Int']>,
  venue?: Maybe<Scalars['Int']>,
  year?: Maybe<Scalars['Int']>,
  location?: Maybe<Scalars['String']>,
  conference_start?: Maybe<Scalars['Date']>,
  conference_end?: Maybe<Scalars['Date']>,
  homepage?: Maybe<Scalars['String']>,
  created_at?: Maybe<Scalars['Date']>,
  updated_at?: Maybe<Scalars['Date']>,
};


export type StrapiVenueVenue_YearsConference_StartArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type StrapiVenueVenue_YearsConference_EndArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type StrapiVenueVenue_YearsCreated_AtArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};


export type StrapiVenueVenue_YearsUpdated_AtArgs = {
  formatString?: Maybe<Scalars['String']>,
  fromNow?: Maybe<Scalars['Boolean']>,
  difference?: Maybe<Scalars['String']>,
  locale?: Maybe<Scalars['String']>
};

export type StrapiVenueVenue_YearsFilterInput = {
  id?: Maybe<IntQueryOperatorInput>,
  venue?: Maybe<IntQueryOperatorInput>,
  year?: Maybe<IntQueryOperatorInput>,
  location?: Maybe<StringQueryOperatorInput>,
  conference_start?: Maybe<DateQueryOperatorInput>,
  conference_end?: Maybe<DateQueryOperatorInput>,
  homepage?: Maybe<StringQueryOperatorInput>,
  created_at?: Maybe<DateQueryOperatorInput>,
  updated_at?: Maybe<DateQueryOperatorInput>,
};

export type StrapiVenueVenue_YearsFilterListInput = {
  elemMatch?: Maybe<StrapiVenueVenue_YearsFilterInput>,
};

export type StringQueryOperatorInput = {
  eq?: Maybe<Scalars['String']>,
  ne?: Maybe<Scalars['String']>,
  in?: Maybe<Array<Maybe<Scalars['String']>>>,
  nin?: Maybe<Array<Maybe<Scalars['String']>>>,
  regex?: Maybe<Scalars['String']>,
  glob?: Maybe<Scalars['String']>,
};

export type VenuesQueryVariables = {};


export type VenuesQuery = { allStrapiVenue: { nodes: Array<Pick<StrapiVenue, 'id' | 'strapiId' | 'long_name' | 'short_name' | 'type'>> } };

export type AllMembersQueryVariables = {};


export type AllMembersQuery = { allStrapiAuthor: { nodes: Array<(
      Pick<StrapiAuthor, 'id' | 'given_name' | 'family_name' | 'middle_name' | 'homepage' | 'short_bio' | 'membership'>
      & { headshot: Maybe<{ childImageSharp: Maybe<{ fluid: Maybe<> }> }> }
    )> } };

export type MembersAndLeadsQueryVariables = {};


export type MembersAndLeadsQuery = { allStrapiAuthor: { nodes: Array<(
      Pick<StrapiAuthor, 'id' | 'strapiId' | 'given_name' | 'family_name' | 'middle_name' | 'homepage' | 'short_bio' | 'membership'>
      & { headshot: Maybe<{ childImageSharp: Maybe<{ fluid: Maybe<> }> }> }
    )> }, allStrapiPublication: { nodes: Array<(
      Pick<StrapiPublication, 'id' | 'title' | 'award' | 'award_description' | 'pub_details' | 'short_description'>
      & { authors: Maybe<Array<Maybe<Pick<StrapiPublicationAuthors, 'id' | 'given_name' | 'family_name' | 'homepage' | 'membership'>>>>, venue_year: Maybe<Pick<StrapiPublicationVenue_Year, 'id' | 'location' | 'venue' | 'year' | 'homepage' | 'conference_start' | 'conference_end'>>, pdf: Maybe<Pick<File, 'publicURL'>> }
    )> } };

export type AllPubsQueryVariables = {};


export type AllPubsQuery = { allStrapiPublication: { nodes: Array<(
      Pick<StrapiPublication, 'id' | 'title' | 'award' | 'award_description' | 'pub_details' | 'short_description'>
      & { authors: Maybe<Array<Maybe<Pick<StrapiPublicationAuthors, 'id' | 'given_name' | 'family_name' | 'homepage' | 'membership'>>>>, venue_year: Maybe<Pick<StrapiPublicationVenue_Year, 'id' | 'location' | 'venue' | 'year' | 'homepage' | 'conference_start' | 'conference_end'>>, pdf: Maybe<(
        Pick<File, 'publicURL'>
        & { childImageSharp: Maybe<{ fixed: Maybe<> }> }
      )> }
    )> } };

export type MemberQueryVariables = {
  id: Scalars['String']
};


export type MemberQuery = { strapiAuthor: Maybe<(
    Pick<StrapiAuthor, 'id' | 'strapiId' | 'given_name' | 'family_name' | 'middle_name' | 'homepage' | 'short_bio' | 'long_bio' | 'membership'>
    & { links: Maybe<Array<Maybe<Pick<StrapiAuthorLinks, 'id' | 'url' | 'description'>>>>, headshot: Maybe<{ childImageSharp: Maybe<{ fluid: Maybe<> }> }> }
  )> };

export type PublicationQueryVariables = {
  id: Scalars['String']
};


export type PublicationQuery = { strapiPublication: Maybe<(
    Pick<StrapiPublication, 'id' | 'title' | 'abstract' | 'award'>
    & { pdf: Maybe<Pick<File, 'id' | 'publicURL'>>, authors: Maybe<Array<Maybe<Pick<StrapiPublicationAuthors, 'id' | 'membership' | 'given_name' | 'family_name' | 'homepage'>>>>, venue_year: Maybe<Pick<StrapiPublicationVenue_Year, 'id' | 'year' | 'venue' | 'homepage'>> }
  )>, allStrapiVenue: { nodes: Array<Pick<StrapiVenue, 'id' | 'strapiId' | 'long_name' | 'short_name' | 'type'>> } };
