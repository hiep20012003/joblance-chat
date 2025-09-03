import mongoose, { ObjectId } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { IOffer } from '@chat/types/order';
import { ISellerGig } from '@chat/types/gig';
import { ISellerDocument } from '@chat/types/seller';

export interface IConversationDocument extends Document {
  _id: mongoose.Types.ObjectId | string;
  conversationId: string;
  senderUsername: string;
  receiverUsername: string;
}

export interface IMessageDocument {
  _id?: string | ObjectId;
  conversationId?: string;
  body?: string;
  url?: string;
  file?: string;
  fileType?: string;
  fileSize?: string;
  fileName?: string;
  gigId?: string;
  sellerId?: string;
  buyerId?: string;
  senderUsername?: string;
  senderPicture?: string;
  receiverUsername?: string;
  receiverPicture?: string;
  isRead?: boolean;
  hasOffer?: boolean;
  offer?: IOffer;
  hasConversationId?: boolean;
  createdAt?: Date | string;
}

export interface IMessageDetails {
  sender?: string;
  offerLink?: string;
  amount?: string;
  buyerUsername?: string;
  sellerUsername?: string;
  title?: string;
  description?: string;
  deliveryDays?: string;
  template?: string;
}

export interface IChatBoxProps {
  seller: IChatSellerProps;
  buyer: IChatBuyerProps
  gigId: string;
  onClose: ()=> void;
}

export interface IChatSellerProps {
  _id: string;
  username: string;
  profilePicture: string;
  responseTime: number;
}

export interface IChatBuyerProps {
  _id: string;
  username: string;
  profilePicture: string;
}

export interface IChatMessageProps {
  message: IMessageDocument;
  seller?: ISellerDocument;
  gig?: ISellerGig;
}
export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract status: string;
  comingFrom: string;

  constructor(message: string, comingFrom: string) {
    super(message);
    this.comingFrom = comingFrom;
  }
}
export class BadRequestError extends CustomError {
  statusCode = StatusCodes.BAD_REQUEST;
  status = 'error';

  constructor(message: string, comingFrom: string) {
    super(message, comingFrom);
  }
}

export async function uploads(
  file: string,
  public_id?: string,
  overwrite?: boolean,
  invalidate?: boolean
): Promise<UploadApiResponse | UploadApiErrorResponse> {
  try {
    const result: UploadApiResponse = await cloudinary.uploader.upload(file, {
      public_id,
      overwrite,
      invalidate,
      resource_type: 'auto',
    });
    return result;
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'message' in err) {
      return err as UploadApiErrorResponse;
    }
    return {
      message: 'Unknown upload error',
      name: 'UploadError',
      http_code: 500,
    } as UploadApiErrorResponse;
  }
}
export {
  firstLetterUppercase,
  lowerCase,
  toUpperCase,
  isEmail,
  isDataURL
} from '@chat/types/helpers';