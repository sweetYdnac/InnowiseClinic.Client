import { Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { FunctionComponent } from 'react';
import ICard from '../types/common/ICard';
import Card from './Card';

interface CardsGridProps {
    items: ICard[];
}

const CardsGrid: FunctionComponent<CardsGridProps> = ({ items }) => {
    return (
        <Box sx={{ flexGrow: 1, p: 2 }}>
            <Grid container justifyContent='space-evenly' rowGap={{ xs: 3, sm: 5 }} columnGap={{ xs: 2, md: 4 }}>
                {items.map((item) => (
                    <Card key={item.id} item={item} />
                ))}
            </Grid>
        </Box>
    );
};

export default CardsGrid;
