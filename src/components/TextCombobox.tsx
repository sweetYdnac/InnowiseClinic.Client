import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import IOfficeInformationResponse from '../types/offices_api/responses/IOfficeInformationResponse';
import OfficesService from '../services/OfficesService';
import IGetPagedOfficesRequest from '../types/offices_api/requests/IGetPagedOfficesRequest';

export default function Asynchronous() {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<
        readonly IOfficeInformationResponse[]
    >([]);
    const loading = open && options.length === 0;

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        let data = {
            currentPage: 1,
            pageSize: 50,
        } as IGetPagedOfficesRequest;

        const request = async () => {
            let offices = await OfficesService.getPaged(data);

            if (active) {
                setOptions(offices.items);
            }
        };

        request();

        return () => {
            active = false;
        };
    }, [loading]);

    return (
        <Autocomplete
            id='asynchronous-demo'
            sx={{ width: 300 }}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.address}
            options={options}
            loading={loading}
            onChange={() => console.log('onchange')}
            onInputChange={() => console.log('oninputchange')}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label='Office'
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? (
                                    <CircularProgress
                                        color='inherit'
                                        size={20}
                                    />
                                ) : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    );
}
