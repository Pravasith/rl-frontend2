import React from 'react';

import { NavBarLoadingIcon } from '../../../assets/images';
import '../../../assets/css/loaders.css'

export function ModalTransitionLoader() {
    return (
        <div className="loadingWrapperProducts">
            <div className="loadingWrapperProductsInnerLayer">
                <NavBarLoadingIcon />
                <h3 className="loadingHeader"></h3>
            </div>
        </div>
    )
}

export function SimpleShadeTransitionLoader() {
    return (
        <div className="outer-loading-wrap-simple">
            <div className="simple-loader-inner-wrap loadingGradient">
            </div>
        </div>
    )
}

