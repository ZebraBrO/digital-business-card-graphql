import { Module } from '@nestjs/common';
import { ProfileDataLoader } from './dataloaders/profile.dataloader';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';

@Module({
  providers: [ProfileResolver, ProfileService, ProfileDataLoader],
  exports: [ProfileService],
})
export class ProfileModule {}
