import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import ICard from '../../types/common/ICard';
import './Card.css';

interface CardProps<T> {
    item: ICard<T>;
}

const DoctorCard = <T,>({ item }: CardProps<T>) => {
    const navigate = useNavigate();

    return (
        <Card
            className='card'
            sx={{
                maxWidth: 250,
                cursor: 'pointer',
                boxShadow: '4px 4px 8px 0px rgba(52, 58, 64, 0.5)',
                transition: 'all 0.15s ease-in',
                position: 'relative',
            }}
            onClick={() => navigate(`/doctors/${item.id}`, { state: item.dto })}
        >
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
