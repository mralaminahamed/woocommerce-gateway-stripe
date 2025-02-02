import { __ } from '@wordpress/i18n';
import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import classNames from 'classnames';
import { Card, VisuallyHidden } from '@wordpress/components';
import LoadableSettingsSection from '../loadable-settings-section';
import LegacyExperienceTransitionNotice from '../notices/legacy-experience-transition';
import SectionHeading from './section-heading';
import SectionFooter from './section-footer';
import PaymentMethodsList from './payment-methods-list';
import UpeToggleContext from 'wcstripe/settings/upe-toggle/context';
import { useAccount } from 'wcstripe/data/account';
import { useGetOrderedPaymentMethodIds } from 'wcstripe/data';
import './styles.scss';

const AccountRefreshingOverlay = styled.div`
	position: relative;
	&.has-overlay {
		animation: loading-fade 1.6s ease-in-out infinite;

		&:after {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			content: ' ';
			background: white;
			opacity: 0.4;
		}
	}
`;

const GeneralSettingsSection = ( {
	onSaveChanges,
	showLegacyExperienceTransitionNotice,
} ) => {
	const [ isChangingDisplayOrder, setIsChangingDisplayOrder ] = useState(
		false
	);
	const { isUpeEnabled, setIsUpeEnabled } = useContext( UpeToggleContext );
	const { isRefreshing } = useAccount();
	const {
		orderedPaymentMethodIds,
		setOrderedPaymentMethodIds,
	} = useGetOrderedPaymentMethodIds();

	const [ initialOrder, setInitialOrder ] = useState( [] );

	const onChangeDisplayOrder = ( isChanging, data = null ) => {
		if ( isChanging ) {
			// Store the initial order before entering reorder mode
			setInitialOrder( [ ...orderedPaymentMethodIds ] );
		} else if ( ! data ) {
			// This is a cancel action - restore the initial order
			if ( initialOrder.length > 0 ) {
				setOrderedPaymentMethodIds( initialOrder );
			}
			setInitialOrder( [] );
		} else {
			// This is a save action
			onSaveChanges( 'ordered_payment_method_ids', data );
			setInitialOrder( [] );
		}

		setIsChangingDisplayOrder( isChanging );
	};

	return (
		<>
			{ showLegacyExperienceTransitionNotice && (
				<LegacyExperienceTransitionNotice
					isUpeEnabled={ isUpeEnabled }
					setIsUpeEnabled={ setIsUpeEnabled }
				/>
			) }
			<Card>
				<LoadableSettingsSection numLines={ 30 }>
					<SectionHeading
						isChangingDisplayOrder={ isChangingDisplayOrder }
						onChangeDisplayOrder={ onChangeDisplayOrder }
					/>
					{ isRefreshing && (
						<VisuallyHidden>
							{ __(
								'Updating payment methods information, please wait.',
								'woocommerce-gateway-stripe'
							) }
						</VisuallyHidden>
					) }
					<AccountRefreshingOverlay
						className={ classNames( {
							'has-overlay': isRefreshing,
						} ) }
					>
						<PaymentMethodsList
							isChangingDisplayOrder={ isChangingDisplayOrder }
							onSaveChanges={ onSaveChanges }
							onCancel={ () => onChangeDisplayOrder( false ) }
						/>
					</AccountRefreshingOverlay>
					{ isUpeEnabled && <SectionFooter /> }
				</LoadableSettingsSection>
			</Card>
		</>
	);
};

export default GeneralSettingsSection;
