import { ApplicationRef, ComponentRef, createComponent } from '@angular/core';
import { createApplication } from '@angular/platform-browser';

import { ProfileAppComponent } from './profile-app.component';

export interface ProfileAngularMount {
  unmount(): void;
}

export async function mountProfileApp(container: HTMLElement): Promise<ProfileAngularMount> {
  container.textContent = '';

  const appRef = await createApplication();
  const componentRef = createComponent(ProfileAppComponent, {
    environmentInjector: appRef.injector,
    hostElement: container,
  });
  appRef.attachView(componentRef.hostView);

  return {
    unmount(): void {
      destroyProfileApp(appRef, componentRef);
    },
  };
}

function destroyProfileApp(
  appRef: ApplicationRef,
  componentRef: ComponentRef<ProfileAppComponent>,
): void {
  appRef.detachView(componentRef.hostView);
  componentRef.destroy();
  appRef.destroy();
}
