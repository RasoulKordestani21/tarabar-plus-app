import * as Yup from "yup";

const driverConfirmationInitialValues = (data: any) => {
  return {
    userName: data?.user?.userName ?? "",
    driverSmartNumber: data?.user?.driverSmartNumber ?? "",
    truckSmartNumber: data?.user?.truckSmartNumber ?? "",
    nationalId: data?.user?.nationalId ?? "",
    truckNavigationId: data?.user?.truckNavigationId ?? "",
    licensePlate: data?.user?.licensePlate ?? "",
    nationalCard: data?.user?.nationalCard ?? ""
  };
};
const driverConfirmValidationSchema = Yup.object().shape({
  nationalId: Yup.string()
    .matches(/^\d{10}$/, "کد ملی 10 رقمی می‌باشد .")
    .max(10, "کد ملی باید 10 رقم باشد.")
    .required("کد ملی الزامی است"),
  userName: Yup.string()
    .min(4, "حداقل ۴ حرف")
    .max(20, "نام کاربری نباید بیشتر از 20 حرف باشد")
    .required("نام کاربری الزامی است"),
  driverSmartNumber: Yup.string()
    .matches(/^\d{7}$/, "هوشمند راننده 7 رقمی می‌باشد .")
    .max(7, "شماره هوشمند راننده باید 7 رقم باشد.")
    .required("شماره هوشمند راننده الزامی است"),
  truckSmartNumber: Yup.string()
    .matches(/^\d{7}$/, "هوشمند خودرو 7 رقمی می‌باشد .")
    .max(7, "شماره هوشمند خودرو باید 7 رقم باشد.")
    .required("شماره هوشمند خودرو الزامی است"),
  nationalCard: Yup.mixed()
    .test("fileType", "تایپ های قابل قبول (JPG, PNG, JPEG)", (value: any) => {
      if (typeof value === "string" && value?.length) {
        return true;
      }
      return value && value?.mimeType?.startsWith("image/");
    })
    .test("fileSize", "فایل کمتر از ۳ مگابایت", (value: any) => {
      if (typeof value === "string" && value?.length) {
        return true;
      }
      return value && value.size < 3000000;
    }),
  licensePlate: Yup.string()
    .matches(/^\d{2}-\d{3}-\d{2}$/, "شماره پلاک را کامل کنید.") // Regex to match the pattern
    .required("شماره پلاک الزامی است"),
  truckNavigationId: Yup.string().required(" نوع کشنده الزامی است. ")
});

const cargoOwnerConfirmationInitialValues = (data: any) => {
  return {
    userName: data?.user?.userName ?? "",
    nationalId: data?.user?.nationalId ?? "",
    nationalCard: data?.user?.nationalCard ?? ""
  };
};
const cargoOwnerConfirmValidationSchema = Yup.object().shape({
  nationalId: Yup.string()
    .matches(/^\d{10}$/, "کد ملی 10 رقمی می‌باشد .")
    .max(10, "کد ملی باید 10 رقم باشد.")
    .required("کد ملی الزامی است"),
  userName: Yup.string()
    .min(4, "حداقل ۴ حرف")
    .max(20, "نام کاربری نباید بیشتر از 20 حرف باشد")
    .required("نام کاربری الزامی است"),
  nationalCard: Yup.mixed()
    .test("fileType", "تایپ های قابل قبول (JPG, PNG, JPEG)", (value: any) => {
      if (typeof value === "string" && value?.length) {
        return true;
      }
      return value && value?.mimeType?.startsWith("image/");
    })
    .test("fileSize", "فایل کمتر از ۳ مگابایت", (value: any) => {
      if (typeof value === "string" && value?.length) {
        return true;
      }
      return value && value.size < 3000000;
    })
});

const estimateFeeAndCommisionInitialValues = () => {
  return {
    origin: "",
    destination: "",
    truckType: "",
    cargoType: "",
    insurancePercentage: ""
  };
};

const estimateFeeAndCommisionSchema = Yup.object().shape({
  origin: Yup.string().required("مبدا الزامی است "),
  destination: Yup.string().required("مقصد الزامی است "),
  truckType: Yup.string().required(" نوع کشنده الزامی است "),
  cargoType: Yup.string().required(" نوع بار الزامی است "),
  insurancePercentage: Yup.string()
    .matches(/^(\d{1,2}|100)$/, "عدد بین ۰ تا ۱۰۰")
    .required("درصد بیمه الزامی است")
});

const smartCardInquiryInitialValues = () => {
  return {
    natioanlId: "",
    driverSmartNumber: "",
    licensePlate: ""
  };
};

const smartCardInquirySchema = Yup.object().shape({
  nationalId: Yup.string()
    .matches(/^\d{10}$/, "کد ملی 10 رقمی می‌باشد .")
    .max(10, "کد ملی باید 10 رقم باشد.")
    .required("کد ملی الزامی است"),
  driverSmartNumber: Yup.string()
    .matches(/^\d{8}$/, "هوشمند راننده 8 رقمی می‌باشد .")
    .max(8, "شماره هوشمند راننده باید 8 رقم باشد.")
    .required("شماره هوشمند راننده الزامی است"),
  licensePlate: Yup.string()
    .matches(/^\d{2}-\d{3}-\d{2}$/, "شماره پلاک را کامل کنید.") // Regex to match the pattern
    .required("شماره پلاک الزامی است")
});

const createCargoInitialValues = (data: any) => {
  return {
    origin: data?.origin?.cityId || "",
    destination: data?.destination?.cityId || "",
    truckType: data?.truckType || "",
    cargoType: data?.cargoType || "",
    // insurancePercentage: data?.insurancePercentage || "",
    transportType: data?.transportType || "",
    cargoWeight: data?.cargoWeight || "",
    fee: data?.fee || "",
    description: data?.description || ""
  };
};

const createCargoSchema = Yup.object().shape({
  origin: Yup.string().required("مبدا الزامی است "),
  destination: Yup.string().required("مقصد الزامی است "),
  truckType: Yup.string().required(" نوع کشنده الزامی است "),
  cargoType: Yup.string().required(" نوع بار الزامی است "),
  // insurancePercentage: Yup.string()
  //   .matches(/^(\d{1,2}|100)$/, "عدد بین ۰ تا ۱۰۰")
  //   .required("درصد بیمه الزامی است"),
  transportType: Yup.string().required("یکی از گزینه ها را انتخاب کنید "),
  cargoWeight: Yup.string()
    .matches(/^(\d{1,2}|100)$/, "عدد بین ۰ تا ۱۰۰")
    .test(
      "is-required-if-transport-type-3",
      "وزن بار الزامی است",
      function (value) {
        const { transportType } = this.parent; // Access other fields' values in the form
        if (transportType === "3" && !value) {
          return false; // Return false if cargoWeight is empty when transportType is "3"
        }
        return true; // Return true if it's valid or if transportType is not "3"
      }
    ),
  fee: Yup.string()
    .matches(
      /^(100000000|[1-9]{1}[0-9]{0,7}|[0]{1})$/,
      "عدد بین ۰ تا ۱۰۰,۰۰۰,۰۰۰"
    )
    .required("مبلغ کرایه  الزامی است "),
  description: Yup.string()
    .max(200, "توضیحات کمتر از ۲۰۰ حرف")
    .nullable() // allows the field to be null or undefined
    .notRequired() // makes the field optional
});

export {
  driverConfirmationInitialValues,
  cargoOwnerConfirmationInitialValues,
  estimateFeeAndCommisionInitialValues,
  smartCardInquiryInitialValues,
  createCargoInitialValues,
  driverConfirmValidationSchema,
  cargoOwnerConfirmValidationSchema,
  estimateFeeAndCommisionSchema,
  smartCardInquirySchema,
  createCargoSchema
};
