import React from 'react';
import { Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import TagIcon from '@mui/icons-material/Tag';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Skeleton,
} from '@mui/material';
import { SideBlock } from './SideBlock';
import { fetchPostsByTags } from '../redux/slices/post';

export const TagsBlock = ({ items, isLoading = true }) => {
    const dispatch = useDispatch();

    const postByTags = (name) => {
        dispatch(fetchPostsByTags(name));
    };

    return (
        <SideBlock title="Tags">
            <List>
                {(isLoading ? [...Array(5)] : items).map((name, i) => (
                    <Link
                        key={name}
                        style={{ textDecoration: 'none', color: 'black' }}
                        to={`/tags/${name}`}
                    >
                        <ListItem key={i} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <TagIcon />
                                </ListItemIcon>
                                {isLoading ? (
                                    <Skeleton width={100} />
                                ) : (
                                    <ListItemText
                                        primary={name}
                                        onClick={() => postByTags(name)}
                                    />
                                )}
                            </ListItemButton>
                        </ListItem>
                    </Link>
                ))}
            </List>
        </SideBlock>
    );
};
