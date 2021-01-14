import * as React from 'react';
import {NavigationContainerRef} from '@react-navigation/native';
import {Routes} from '../interfaces/navigation';

export const navigationRef = React.createRef<NavigationContainerRef>();

export function navigate(name: Routes, params?: any) {
  navigationRef.current?.navigate(name, params);
}

export function resetGo(route: Routes) {
  navigationRef.current?.reset({
    index: 0,
    routes: [{name: route}],
  });
}
