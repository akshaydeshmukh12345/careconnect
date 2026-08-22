import { useEffect, useMemo, useState } from "react";

type BiologicalSex =
  | "male"
  | "female"
  | "other"
  | "prefer_not_to_say";

type ActivityLevel =
  | "mostly_sitting"
  | "often_standing"
  | "regularly_active"
  | "physically_intense";

interface HealthProfileData {
  age?: number;
  biologicalSex?: BiologicalSex;
  height?: number;
  weight?: number;
  activityLevel?: ActivityLevel;
  medicalConditions: string[];
}

const API_URL = "https://careconnect-1-chxq.onrender.com";

const conditions = [
  "None",
  "Pre-Diabetes",
  "High Cholesterol",
  "High Blood Pressure",
  "PCOD",
  "GERD",
  "Thyroid",
  "Injury",
  "Anxiety",
  "Depression",
  "Sleep Apnea",
  "Osteoarthritis",
  "Lymphedema",
];

const HealthProfile = () => {
  const [step, setStep] = useState(1);

  const [profile, setProfile] =
    useState<HealthProfileData>({
      age: undefined,
      biologicalSex: undefined,
      height: undefined,
      weight: undefined,
      activityLevel: undefined,
      medicalConditions: [],
    });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const totalSteps = 6;

  // =========================
  // LOAD EXISTING PROFILE
  // =========================

  useEffect(() => {
    const loadHealthProfile = async () => {
      try {
        const token =
          localStorage.getItem("token");

        if (!token) {
          setError(
            "Please login to manage your health profile."
          );
          return;
        }

        const response = await fetch(
          `${API_URL}/api/users/health-profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load health profile"
          );
        }

        if (data.healthProfile) {
          setProfile({
            age: data.healthProfile.age,
            biologicalSex:
              data.healthProfile.biologicalSex,
            height: data.healthProfile.height,
            weight: data.healthProfile.weight,
            activityLevel:
              data.healthProfile.activityLevel,
            medicalConditions:
              data.healthProfile.medicalConditions ||
              [],
          });
        }
      } catch (err) {
        console.error(
          "Load health profile error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load health profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadHealthProfile();
  }, []);

  // =========================
  // BMI
  // =========================

  const bmi = useMemo(() => {
    if (
      !profile.height ||
      !profile.weight
    ) {
      return null;
    }

    const heightInMeters =
      profile.height / 100;

    if (heightInMeters <= 0) {
      return null;
    }

    return (
      profile.weight /
      (heightInMeters * heightInMeters)
    ).toFixed(1);
  }, [
    profile.height,
    profile.weight,
  ]);

  // =========================
  // VALIDATION
  // =========================

  const validateStep = () => {
    setError("");

    if (step === 1) {
      if (!profile.age) {
        setError("Please enter your age.");
        return false;
      }

      if (
        profile.age < 1 ||
        profile.age > 120
      ) {
        setError(
          "Please enter an age between 1 and 120."
        );
        return false;
      }
    }

    if (step === 2) {
      if (!profile.biologicalSex) {
        setError(
          "Please select an option."
        );
        return false;
      }
    }

    if (step === 3) {
      if (!profile.height) {
        setError(
          "Please enter your height."
        );
        return false;
      }

      if (
        profile.height < 30 ||
        profile.height > 300
      ) {
        setError(
          "Please enter a valid height in centimeters."
        );
        return false;
      }
    }

    if (step === 4) {
      if (!profile.weight) {
        setError(
          "Please enter your weight."
        );
        return false;
      }

      if (
        profile.weight < 1 ||
        profile.weight > 500
      ) {
        setError(
          "Please enter a valid weight in kilograms."
        );
        return false;
      }
    }

    if (step === 5) {
      if (!profile.activityLevel) {
        setError(
          "Please select your activity level."
        );
        return false;
      }
    }

    return true;
  };

  // =========================
  // NEXT
  // =========================

  const handleNext = () => {
    if (!validateStep()) {
      return;
    }

    if (step < totalSteps) {
      setStep((current) => current + 1);
      setError("");
    }
  };

  // =========================
  // BACK
  // =========================

  const handleBack = () => {
    if (step > 1) {
      setStep((current) => current - 1);
      setError("");
    }
  };

  // =========================
  // CONDITIONS
  // =========================

  const toggleCondition = (
    condition: string
  ) => {
    if (condition === "None") {
      setProfile((current) => ({
        ...current,
        medicalConditions: ["None"],
      }));

      return;
    }

    setProfile((current) => {
      const currentConditions =
        current.medicalConditions.filter(
          (item) => item !== "None"
        );

      if (
        currentConditions.includes(condition)
      ) {
        return {
          ...current,
          medicalConditions:
            currentConditions.filter(
              (item) => item !== condition
            ),
        };
      }

      return {
        ...current,
        medicalConditions: [
          ...currentConditions,
          condition,
        ],
      };
    });
  };

  // =========================
  // SAVE
  // =========================

  const handleSave = async () => {
    setError("");
    setSuccess("");

    setSaving(true);

    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Please login to save your health profile."
        );
      }

      const response = await fetch(
        `${API_URL}/api/users/health-profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            age: profile.age,
            biologicalSex:
              profile.biologicalSex,
            height: profile.height,
            weight: profile.weight,
            activityLevel:
              profile.activityLevel,
            medicalConditions:
              profile.medicalConditions,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save health profile"
        );
      }

      setSuccess(
        "Health profile saved successfully."
      );
    } catch (err) {
      console.error(
        "Save health profile error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save health profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-slate-500">
          Loading health profile...
        </p>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-4 py-8">

      <div className="mx-auto max-w-2xl">

        {/* Header */}

        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
            ❤️
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Build Your Health Profile
          </h1>

          <p className="mt-2 text-slate-500">
            Help CareConnect understand your
            wellness needs.
          </p>

        </div>


        {/* Progress */}

        <div className="mb-8">

          <div className="mb-2 flex justify-between text-sm">

            <span className="font-medium text-slate-700">
              Step {step} of {totalSteps}
            </span>

            <span className="text-slate-500">
              {Math.round(
                (step / totalSteps) * 100
              )}
              %
            </span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200">

            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${
                  (step / totalSteps) * 100
                }%`,
              }}
            />

          </div>

        </div>


        {/* Card */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          {/* STEP 1 */}

          {step === 1 && (
            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                What is your age?
              </h2>

              <p className="mt-2 text-slate-500">
                This helps us provide more
                relevant wellness information.
              </p>

              <div className="mt-8">

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Age
                </label>

                <input
                  type="number"
                  min="1"
                  max="120"
                  value={
                    profile.age ?? ""
                  }
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      age:
                        event.target.value
                          ? Number(
                              event.target.value
                            )
                          : undefined,
                    })
                  }
                  placeholder="Enter your age"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>
          )}


          {/* STEP 2 */}

          {step === 2 && (
            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                What is your biological sex?
              </h2>

              <p className="mt-2 text-slate-500">
                Select the option you're most
                comfortable providing.
              </p>

              <div className="mt-8 grid gap-3">

                {[
                  {
                    value: "male",
                    label: "Male",
                    icon: "♂️",
                  },
                  {
                    value: "female",
                    label: "Female",
                    icon: "♀️",
                  },
                  {
                    value: "other",
                    label: "Other",
                    icon: "⚪",
                  },
                  {
                    value:
                      "prefer_not_to_say",
                    label:
                      "Prefer not to say",
                    icon: "🔒",
                  },
                ].map((item) => (

                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setProfile({
                        ...profile,
                        biologicalSex:
                          item.value as BiologicalSex,
                      })
                    }
                    className={`flex items-center gap-4 rounded-xl border p-4 text-left transition ${
                      profile.biologicalSex ===
                      item.value
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >

                    <span className="text-2xl">
                      {item.icon}
                    </span>

                    <span className="font-medium text-slate-800">
                      {item.label}
                    </span>

                  </button>

                ))}

              </div>

            </div>
          )}


          {/* STEP 3 */}

          {step === 3 && (
            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                What is your height?
              </h2>

              <p className="mt-2 text-slate-500">
                Enter your height in centimeters.
              </p>

              <div className="mt-8">

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Height
                </label>

                <div className="relative">

                  <input
                    type="number"
                    min="30"
                    max="300"
                    value={
                      profile.height ?? ""
                    }
                    onChange={(event) =>
                      setProfile({
                        ...profile,
                        height:
                          event.target.value
                            ? Number(
                                event.target.value
                              )
                            : undefined,
                      })
                    }
                    placeholder="e.g. 175"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-16 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                    cm
                  </span>

                </div>

              </div>

            </div>
          )}


          {/* STEP 4 */}

          {step === 4 && (
            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                What is your weight?
              </h2>

              <p className="mt-2 text-slate-500">
                Enter your current weight in
                kilograms.
              </p>

              <div className="mt-8">

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Weight
                </label>

                <div className="relative">

                  <input
                    type="number"
                    min="1"
                    max="500"
                    step="0.1"
                    value={
                      profile.weight ?? ""
                    }
                    onChange={(event) =>
                      setProfile({
                        ...profile,
                        weight:
                          event.target.value
                            ? Number(
                                event.target.value
                              )
                            : undefined,
                      })
                    }
                    placeholder="e.g. 68"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-16 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                    kg
                  </span>

                </div>

              </div>


              {/* BMI Preview */}

              {bmi && (
                <div className="mt-6 rounded-xl bg-blue-50 p-4">

                  <p className="text-sm text-blue-700">
                    Your calculated BMI
                  </p>

                  <p className="mt-1 text-2xl font-bold text-blue-900">
                    {bmi}
                  </p>

                  <p className="mt-1 text-xs text-blue-600">
                    BMI is a general screening
                    measure and is not a medical
                    diagnosis.
                  </p>

                </div>
              )}

            </div>
          )}


          {/* STEP 5 */}

          {step === 5 && (
            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Define your activity level
              </h2>

              <p className="mt-2 text-slate-500">
                Choose the option that best
                describes your usual day.
              </p>

              <div className="mt-8 grid gap-3">

                {[
                  {
                    value:
                      "mostly_sitting",
                    title:
                      "Mostly Sitting",
                    description:
                      "Seated work with low daily movement.",
                    icon: "🪑",
                  },
                  {
                    value:
                      "often_standing",
                    title:
                      "Often Standing",
                    description:
                      "You spend a significant part of your day standing or walking.",
                    icon: "🚶",
                  },
                  {
                    value:
                      "regularly_active",
                    title:
                      "Regularly Active",
                    description:
                      "You frequently walk, exercise, or stay physically active.",
                    icon: "🏃",
                  },
                  {
                    value:
                      "physically_intense",
                    title:
                      "Physically Intense",
                    description:
                      "Your work or routine involves high physical effort.",
                    icon: "🏋️",
                  },
                ].map((item) => (

                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setProfile({
                        ...profile,
                        activityLevel:
                          item.value as ActivityLevel,
                      })
                    }
                    className={`flex items-start gap-4 rounded-xl border p-4 text-left transition ${
                      profile.activityLevel ===
                      item.value
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >

                    <span className="text-2xl">
                      {item.icon}
                    </span>

                    <span>

                      <span className="block font-semibold text-slate-900">
                        {item.title}
                      </span>

                      <span className="mt-1 block text-sm text-slate-500">
                        {item.description}
                      </span>

                    </span>

                  </button>

                ))}

              </div>

            </div>
          )}


          {/* STEP 6 */}

          {step === 6 && (
            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Do you have any medical conditions?
              </h2>

              <p className="mt-2 text-slate-500">
                Select any that apply. You can
                choose multiple options.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">

                {conditions.map(
                  (condition) => {

                    const selected =
                      profile.medicalConditions.includes(
                        condition
                      );

                    return (
                      <button
                        key={condition}
                        type="button"
                        onClick={() =>
                          toggleCondition(
                            condition
                          )
                        }
                        className={`rounded-xl border p-4 text-left text-sm font-medium transition ${
                          selected
                            ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                            : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="flex items-center justify-between">

                          <span>
                            {condition}
                          </span>

                          {selected && (
                            <span>
                              ✓
                            </span>
                          )}

                        </span>
                      </button>
                    );
                  }
                )}

              </div>

            </div>
          )}


          {/* Error */}

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}


          {/* Success */}

          {success && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              {success}
            </div>
          )}


          {/* Navigation */}

          <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">

            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1 || saving}
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>


            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Health Profile"}
              </button>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default HealthProfile;
