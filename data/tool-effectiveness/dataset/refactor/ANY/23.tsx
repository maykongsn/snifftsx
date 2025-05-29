import { useUserPreference } from '@rocket.chat/ui-contexts';
import type { ComponentType } from 'react';
import { useMemo } from 'react';

import Condensed from '../Item/Condensed';
import Extended from '../Item/Extended';
import Medium from '../Item/Medium';

type ItemProps = {}

export const useTemplateByViewMode = (): ComponentType<ItemProps> => {
	const sidebarViewMode = useUserPreference('sidebarViewMode');
	return useMemo(() => {
		switch (sidebarViewMode) {
			case 'extended':
				return Extended;
			case 'medium':
				return Medium;
			case 'condensed':
			default:
				return Condensed;
		}
	}, [sidebarViewMode]);
};