export default interface IPagedResponse<T> {
    items: T[];
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}
