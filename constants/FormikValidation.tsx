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
    .matches(/^\d{8}$/, "هوشمند راننده 8 رقمی می‌باشد .")
    .max(8, "شماره هوشمند راننده باید 8 رقم باشد.")
    .required("شماره هوشمند راننده الزامی است"),
  truckSmartNumber: Yup.string()
    .matches(/^\d{9}$/, "هوشمند خودرو 9 رقمی می‌باشد .")
    .max(9, "شماره هوشمند خودرو باید 9 رقم باشد.")
    .required("شماره هوشمند خودرو الزامی است"),
  nationalCard: Yup.mixed()
    .test("fileType", "تایپ های قابل قبول (JPG, PNG, JPEG)", (value: any) => {
      console.log(
        value,
        typeof value === "string" && value?.length,
        value?.mimeType,
        value?.mimeType?.startsWith("image/"),
        "this is schema "
      );
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
  truckNavigationId: Yup.string().required("این فیلد ازامی است ")
});

export { driverConfirmValidationSchema, driverConfirmationInitialValues };
