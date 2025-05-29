import type { IRoom, ISubscription } from '@rocket.chat/core-typings';
import type { ReactElement } from 'react';
import { memo } from 'react';

import UserItem from './UserItem';
import SideBarItemTemplateWithData from '../RoomList/SideBarItemTemplateWithData';

type RowData = {
  t: unknown;
  SideBarItemTemplate: unknown;
  avatarTemplate: unknown;
  useRealName: unknown;
  extended: unknown;
}

type RowProps = {
	item: ISubscription & IRoom;
	data: RowData;
};

const Row = ({ item, data }: RowProps): ReactElement => {
	const { t, SideBarItemTemplate, avatarTemplate: AvatarTemplate, useRealName, extended } = data;

	if (item.t === 'd' && !item.u) {
		return (
			<UserItem
				id={`search-${item._id}`}
				useRealName={useRealName}
				t={t}
				item={item}
				SideBarItemTemplate={SideBarItemTemplate}
				AvatarTemplate={AvatarTemplate}
			/>
		);
	}
	return (
		<SideBarItemTemplateWithData
			id={`search-${item._id}`}
			extended={extended}
			t={t}
			room={item}
			SideBarItemTemplate={SideBarItemTemplate}
			AvatarTemplate={AvatarTemplate}
		/>
	);
};

export default memo(Row);