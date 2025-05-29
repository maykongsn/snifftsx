import { Box, Select, Tabs } from '@rocket.chat/fuselage';
import type { ReactElement } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ChannelsTab from './channels/ChannelsTab';
import MessagesTab from './messages/MessagesTab';
import UsersTab from './users/UsersTab';
import { Page, PageHeader, PageScrollableContent } from '../../../components/Page';

type EngagementTab = 'users' | 'messages' | 'channels';
type TimezoneId = 'utc' | 'local';

const tabLabels: Record<EngagementTab, string> = {
	users: 'Users',
	messages: 'Messages',
	channels: 'Channels',
};

const timezoneLabels: Record<TimezoneId, string> = {
	utc: 'UTC_Timezone',
	local: 'Local_Timezone',
};

type EngagementDashboardPageProps = {
	tab: EngagementTab;
	onSelectTab?: (tab: EngagementTab) => void;
};

const EngagementDashboardPage = ({
	tab = 'users',
	onSelectTab,
}: EngagementDashboardPageProps): ReactElement => {
	const { t } = useTranslation();

	const [timezoneId, setTimezoneId] = useState<TimezoneId>('utc');

	const timezoneOptions = useMemo<[TimezoneId, string][]>(
		() => (Object.keys(timezoneLabels) as TimezoneId[]).map((id) => [id, t(timezoneLabels[id])]),
		[t],
	);

	const handleTimezoneChange = (id: string): void => {
		if (id === 'utc' || id === 'local') {
			setTimezoneId(id);
		}
	};

	const handleTabClick = useCallback(
		(tab: EngagementTab): (() => void) | undefined =>
			onSelectTab ? () => onSelectTab(tab) : undefined,
		[onSelectTab],
	);

	const renderTabContent = (): ReactElement | null => {
		switch (tab) {
			case 'users':
				return <UsersTab timezone={timezoneId} />;
			case 'messages':
				return <MessagesTab timezone={timezoneId} />;
			case 'channels':
				return <ChannelsTab />;
			default:
				return null;
		}
	};

	return (
		<Page background='tint'>
			<PageHeader title={t('Engagement')}>
				<Select
					options={timezoneOptions}
					value={timezoneId}
					onChange={(value) => handleTimezoneChange(String(value))}
					aria-label={t('Default_Timezone_For_Reporting')}
				/>
			</PageHeader>

			<Tabs>
				{(Object.keys(tabLabels) as EngagementTab[]).map((key) => (
					<Tabs.Item key={key} selected={tab === key} onClick={handleTabClick(key)}>
						{t(tabLabels[key])}
					</Tabs.Item>
				))}
			</Tabs>

			<PageScrollableContent padding={0}>
				<Box m={24}>{renderTabContent()}</Box>
			</PageScrollableContent>
		</Page>
	);
};

export default EngagementDashboardPage;
