import { TabList, TabPanel } from '@mui/lab';
import TabContext from '@mui/lab/TabContext';
import { Button, List, ListItem, ListItemText, Tab } from '@mui/material';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import ServiceCategoriesService from '../../services/services_api/ServiceCategoriesService';
import ServicesService from '../../services/services_api/ServicesService';
import IGetPagedServicesRequest from '../../types/services_api/requests/service/IGetPagedServicesRequest';
import IServiceCategoryResponse from '../../types/services_api/responses/categories/IServiceCategoryResponse';
import IServiceInformationResponse from '../../types/services_api/responses/service/IServiceInformationResponse';

interface ICategoryTab {
    categoryId: string;
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    items: IServiceInformationResponse[];
}

interface ServicesProps {}

const Services: FunctionComponent<ServicesProps> = () => {
    const defaultPagingOptions = {
        currentPage: 0,
        pageSize: 1,
        totalPages: 1,
        totalCount: 1,
    };

    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [categories, setCategories] = useState([] as IServiceCategoryResponse[]);
    const [tabs, setTabs] = useState<ICategoryTab[]>([]);

    const fetchServices = useCallback(async () => {
        setIsLoading(true);

        const selectedCategory = tabs.find((item) => item.categoryId === selectedCategoryId);

        const request: IGetPagedServicesRequest = {
            currentPage: (selectedCategory?.currentPage ?? 0) + 1,
            pageSize: selectedCategory?.pageSize ?? 1,
            categoryId: selectedCategory?.categoryId,
            isActive: true,
        };

        const response = await ServicesService.getPaged(request);

        setTabs((prev) =>
            prev.map((item) => {
                if (item.categoryId === selectedCategoryId) {
                    return {
                        categoryId: selectedCategoryId,
                        currentPage: response.currentPage,
                        pageSize: response.pageSize,
                        totalCount: response.totalCount,
                        totalPages: response.totalPages,
                        items: [...item.items, ...response.items],
                    };
                }

                return item;
            })
        );

        setIsLoading(false);
    }, [selectedCategoryId, tabs]);

    useEffect(() => {
        const initCategories = async () => {
            const categories = (await ServiceCategoriesService.getAll()).categories;

            categories.forEach((item) => {
                const tab = {
                    ...defaultPagingOptions,
                    categoryId: item.id,
                    items: [],
                };

                setTabs((prev) => [...prev, tab]);
            });

            setSelectedCategoryId(categories[0].id);
            setCategories(categories);
        };

        initCategories();
    }, []);

    useEffect(() => {
        if (!selectedCategoryId) {
            return;
        }

        const selectedCategory = tabs.find((item) => item.categoryId === selectedCategoryId);

        if ((selectedCategory?.items.length ?? 0) > 0 || selectedCategory?.totalCount === 0) {
            return;
        }

        fetchServices();
    }, [selectedCategoryId]);

    const handleChangeTab = (event: React.SyntheticEvent, value: string) => {
        setSelectedCategoryId(value);
    };

    const handleLoadMore = async () => {
        await fetchServices();
    };

    return (
        <>
            {categories.length > 0 && (
                <TabContext value={selectedCategoryId}>
                    <TabList onChange={handleChangeTab} variant='fullWidth'>
                        {categories.map((item) => (
                            <Tab key={item.id} label={item.title} value={item.id} />
                        ))}
                    </TabList>
                    {isLoading ? (
                        <Loader isOpen={true} />
                    ) : (
                        <>
                            {tabs.map((tab) => (
                                <TabPanel key={tab.categoryId} value={tab.categoryId}>
                                    <List>
                                        {tab.items.map((item) => (
                                            <ListItem key={item.id}>
                                                <ListItemText primary={item.title} />
                                            </ListItem>
                                        ))}
                                    </List>
                                    <Button onClick={handleLoadMore} disabled={tab.totalCount <= tab.pageSize * tab.currentPage}>
                                        Load more
                                    </Button>
                                </TabPanel>
                            ))}
                        </>
                    )}
                </TabContext>
            )}
        </>
    );
};

export default Services;
