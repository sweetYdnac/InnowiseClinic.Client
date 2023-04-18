import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { FunctionComponent } from 'react';
import ICard from '../types/common/ICard';

interface CardProps {
    item: ICard;
}

const DoctorCard: FunctionComponent<CardProps> = ({ item }) => {
    return (
        <Card sx={{ maxWidth: 250 }}>
            <CardHeader title={item.title} subheader={item.subtitle} />
            <CardMedia component='img' height='100' src={item.photo} alt='photo' />
            <CardContent>
                <Typography variant='subtitle2' color='text.secondary'>
                    {item.content}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default DoctorCard;
