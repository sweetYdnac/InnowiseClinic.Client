import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Pagination, PaginationItem } from '@mui/material';
import { FunctionComponent } from 'react';
import IPagination from '../../types/common/IPagingData';

interface PaginatorProps {
    data: IPagination;
    handleChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const Paginator: FunctionComponent<PaginatorProps> = ({ data, handleChange }) => {
    return (
        <Pagination
            count={data.totalPages}
            page={data.currentPage}
            onChange={handleChange}
            variant='outlined'
            shape='rounded'
            siblingCount={2}
            renderItem={(item) => (
                <PaginationItem
                    slots={{ previous: KeyboardArrowLeftIcon, next: KeyboardArrowRightIcon }}
                    {...item}
                    disabled={item.page === data.currentPage}
                />
            )}
        />
    );
};

export default Paginator;
